import {
  useCreateRewardMutation,
  useDeleteRewardMutation,
  useUpdateRewardMutation,
} from '@app/frontend-admin/mutations/rewards';
import { useActionsQuery } from '@app/frontend-admin/queries/actions';
import { useRewardsQuery } from '@app/frontend-admin/queries/rewards';
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
import { RewardForm, RewardFormInput } from './RewardForm';

export function RewardsPage() {
  const actionsQuery = useActionsQuery();
  const rewardsQuery = useRewardsQuery();

  const actions = actionsQuery.data ?? [];
  const rewards = rewardsQuery.data ?? [];

  const updateMutation = useUpdateRewardMutation();
  const createMutation = useCreateRewardMutation();
  const deleteMutation = useDeleteRewardMutation();

  if (rewardsQuery.isLoading) {
    return <Loader />;
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

  const handleSave = (index: number, data: RewardFormInput) => {
    const reward = rewards[index];

    if (reward) {
      updateMutation.mutate({
        id: reward.id,
        title: data.title,
        cost: data.cost,
      });
    }
  };

  const handleCreate = (data: RewardFormInput) => {
    const action = actions.find((action) => action.id === data.actionId);

    console.log(data.actionId, actions);

    if (action) {
      createMutation.mutate({
        actionId: action.id,
        title: action.title,
        isActive: true,
        cost: data.cost ?? 0,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          {/* <Button variant="default">
            <Plus className="mr-2" />
            Add new reward
          </Button> */}

          <RewardForm
            edit={false}
            title={''}
            cost={0}
            onSave={(data) => handleCreate(data)}
          ></RewardForm>
        </div>

        <Table>
          <TableCaption>A list of custom rewards</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead className="w-[100px]">Command</TableHead>
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
                  <Checkbox
                    onCheckedChange={(value: boolean) =>
                      handleIsActiveChange(index, value)
                    }
                    checked={reward.isActive}
                    className="block"
                  ></Checkbox>
                </TableCell>
                <TableCell>{reward.actionId}</TableCell>
                <TableCell>{reward.title}</TableCell>
                <TableCell>{reward.cost}</TableCell>
                <TableCell>
                  <RewardForm
                    title={reward.title}
                    cost={reward.cost}
                    onSave={(data) => handleSave(index, data)}
                  ></RewardForm>
                </TableCell>
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
