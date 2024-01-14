import { useCreateRewardMutation, useUpdateRewardMutation } from '@app/frontend-admin/mutations/rewards';
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
import { CustomRewardDelete } from './CustomRewardDelete';
import { CustomRewardForm } from './CustomRewardForm';

export function ChanngelPointsPage() {
  const { isLoading, data } = useRewardsQuery();

  const rewards = data ?? [];

  const updateMutation = useUpdateRewardMutation();

  const createMutation = useCreateRewardMutation();

  if (isLoading) {
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

  const handleDelete = (index: number) => {
    console.log('delete');
  };

  const handleCreate = () => {
    createMutation.mutate({
      actionId: 1,
      cost: 100,
      title: 'test',
      description: 'test',
      cooldown: 0,
      isActive: true,
      isPaused: false,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Button onClick={handleCreate}>Create new reward</Button>
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
            {rewards
              .filter((reward) => reward.id)
              .map((reward, index) => (
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
                    <CustomRewardForm reward={reward}></CustomRewardForm>
                  </TableCell>
                  <TableCell>
                    <CustomRewardDelete
                      onDelete={() => handleDelete(index)}
                    ></CustomRewardDelete>
                  </TableCell>
                </TableRow>
              ))}

            {rewards
              .filter((reward) => !reward.id)
              .map((reward, index) => (
                <TableRow key={'new' + index}>
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
                    <CustomRewardForm
                      isDisabled={true}
                      reward={reward}
                    ></CustomRewardForm>
                  </TableCell>
                  <TableCell>
                    <CustomRewardDelete
                      isDisabled={true}
                      onDelete={() => handleDelete(index)}
                    ></CustomRewardDelete>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
