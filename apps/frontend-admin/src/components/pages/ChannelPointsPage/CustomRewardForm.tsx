import { useForm } from 'react-hook-form';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Reward } from './ChannelPointsPage';

export function CustomRewardForm(props: { reward: Reward }) {
  const { reward } = props;

  const form = useForm({
    defaultValues: reward,
  });

  const onSubmit = (data: Reward) => console.log(data);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Custom Reward</DialogTitle>
            <DialogDescription>
              Make changes to custom reward here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reward-title" className="text-right">
                Title
              </Label>
              <Input
                id="reward-title"
                className="col-span-3"
                {...form.register('title')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reward-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="reward-description"
                className="col-span-3"
                {...form.register('description')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="command-cost" className="text-right">
                Cost
              </Label>
              <Input
                id="command-cost"
                type="number"
                className="col-span-3"
                {...form.register('cost')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="command-cooldown" className="text-right">
                Cooldown
              </Label>
              <Input
                id="command-cooldown"
                type="number"
                className="col-span-3"
                {...form.register('cooldown')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
