import {
  useCreateRewardMutation,
  useDeleteRewardMutation,
  useUpdateRewardMutation,
} from '@app/frontend-admin/mutations/rewards';
import { useRewardsQuery } from '@app/frontend-admin/queries/rewards';
import { Loader } from '../../common/Loader';
import { Button } from '../../ui/button';
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
import { RewardForm } from './RewardForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Plus } from 'lucide-react';
import { useActionsQuery } from '@app/frontend-admin/queries/actions';
import { DeleteDialog } from '../../common/DeleteDialog';

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

  const handleIsPausedChange = (index: number, value: boolean) => {
    const reward = rewards[index];

    if (reward) {
      updateMutation.mutate({ id: reward.id, isPaused: value });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleActionClick = (id: number) => {
    const action = actions.find((action) => action.id === id);

    if (action) {
      createMutation.mutate({
        actionId: id,
        title: action.title,
        description: action.description,
        isActive: true,
        isPaused: false,
        cost: 0,
        cooldown: 0,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">
                <Plus className="mr-2" />
                Add new reward
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                >
                  {action.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableCaption>A list of custom rewards</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead className="w-[100px]">Paused</TableHead>
              <TableHead className="w-[100px]">Command</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
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
                <TableCell>
                  <Checkbox
                    onCheckedChange={(value: boolean) =>
                      handleIsPausedChange(index, value)
                    }
                    checked={reward.isPaused}
                    className="block"
                  ></Checkbox>
                </TableCell>
                <TableCell>{reward.id}</TableCell>
                <TableCell>{reward.title}</TableCell>
                <TableCell>{reward.description}</TableCell>
                <TableCell>{reward.cost}</TableCell>
                <TableCell>
                  <RewardForm reward={reward}></RewardForm>
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