import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { CustomRewardForm } from './CustomRewardForm';

export type Reward = {
  id: string;
  cost: number;
  title: string;
  description: string;
  cooldown: number;
};

const rewards: Reward[] = [
  {
    id: 'jump',
    title: 'Jump',
    description: 'Jump',
    cost: 100,
    cooldown: 0,
  },
  {
    id: 'color',
    title: 'Color',
    description: 'Change color',
    cost: 250,
    cooldown: 0,
  },
];

export function ChanngelPointsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel points</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of custom rewards</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-40">Cost</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.map((reward) => (
              <TableRow key={reward.id}>
                <TableCell className="font-medium">{reward.id}</TableCell>
                <TableCell>{reward.title}</TableCell>
                <TableCell>{reward.description}</TableCell>
                <TableCell>{reward.cost}</TableCell>
                <TableCell>
                  <CustomRewardForm reward={reward}></CustomRewardForm>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
