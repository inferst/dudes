import {
  useCreateRewardMutation,
  useDeleteRewardMutation,
  useUpdateRewardMutation,
} from '@app/frontend-admin/mutations/rewards';
import { useActionsQuery } from '@app/frontend-admin/queries/actions';
import { useRewardsQuery } from '@app/frontend-admin/queries/rewards';
import {
  ActionEntity,
  TwitchRewardEntity
} from '@shared';
import { DeleteDialog } from '../../common/DeleteDialog';
import { Loader } from '../../common/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { AddRewardForm, AddRewardFormInput } from './AddRewardForm';
import { EditRewardForm, EditRewardFormInput } from './EditRewardForm';

export function RewardsPage() {
  const actionsQuery = useActionsQuery();
  const rewardsQuery = useRewardsQuery();

  const actions = actionsQuery.data ?? [];
  const rewards = rewardsQuery.data ?? [];

  const updateMutation = useUpdateRewardMutation();
  const createMutation = useCreateRewardMutation();
  const deleteMutation = useDeleteRewardMutation();

  if (rewardsQuery.isLoading || actionsQuery.isLoading) {
    return <Loader />;
  }

  if (rewardsQuery.isError || actionsQuery.isError) {
    return;
  }

  const handleIsActiveChange = (index: number, value: boolean) => {
    const reward = rewards[index];

    if (reward) {
      updateMutation.mutate({ id: reward.id, isActive: value });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleSave = (index: number, data: EditRewardFormInput) => {
    const reward = rewards[index];

    if (reward) {
      updateMutation.mutate({
        id: reward.id,
        title: data.title,
        cost: data.cost,
        data: data.data,
      });
    }
  };

  const handleAdd = (data: AddRewardFormInput) => {
    const action = actions.find(
      (action) => action.id === Number(data.actionId)
    );

    if (action) {
      createMutation.mutate({
        actionId: action.id,
        title: data.title,
        isActive: true,
        cost: data.cost,
        data: data.data,
      });
    }
  };

  const getAction = (id: number): ActionEntity | undefined =>
    actions.find((action) => action.id === id);

  const rewardForm = (reward: TwitchRewardEntity, index: number) => {
    const action = actions.find((action) => action.id === reward.actionId);

    if (action && reward.title && reward.cost) {
      return (
        <EditRewardForm
          title={reward.title}
          cost={reward.cost}
          action={action}
          data={reward.data}
          onSave={(data) => handleSave(index, data)}
        ></EditRewardForm>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          {actions.length > 0 && (
            <AddRewardForm
              actions={actions}
              onSave={(data) => handleAdd(data)}
            ></AddRewardForm>
          )}
        </div>

        <Table>
          <TableCaption>A list of custom rewards</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-40">Cost</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.map((reward, index) => (
              <TableRow key={reward.id}>
                <TableCell>
                  {!reward.isDeleted && (
                    <Checkbox
                      onCheckedChange={(value: boolean) =>
                        handleIsActiveChange(index, value)
                      }
                      checked={reward.isActive}
                      className="block"
                    ></Checkbox>
                  )}
                </TableCell>
                <TableCell>{getAction(reward.actionId)?.title}</TableCell>
                <TableCell>{reward.title}</TableCell>
                <TableCell>{reward.cost}</TableCell>
                <TableCell>{rewardForm(reward, index)}</TableCell>
                <TableCell>
                  <DeleteDialog
                    onDelete={() => handleDelete(reward.id)}
                  ></DeleteDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}