import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTwitchRewardFormSchema } from '@shared';
import { nanoid } from 'nanoid';
import { useState } from 'react';
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
import { Form } from '../../ui/form';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

export type EditRewardFormInput = {
  title: string;
  cost: number;
};

export type EditRewardFormProps = {
  onSave: (data: EditRewardFormInput) => void;
} & EditRewardFormInput;

export function EditRewardForm(props: EditRewardFormProps) {
  const { title, cost, onSave } = props;

  const [open, setOpen] = useState(false);

  const form = useForm<EditRewardFormInput>({
    resolver: zodResolver(updateTwitchRewardFormSchema),
    defaultValues: {
      title,
      cost,
    },
  });

  const uuid = nanoid();

  const onSubmit = (data: EditRewardFormInput) => {
    onSave(data);
    setOpen(false);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      form.reset();
    }

    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form id={uuid} name={uuid} onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit reward</DialogTitle>
              <DialogDescription>
                Make changes to reward here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reward-text" className="text-right">
                  Title
                </Label>
                <Input
                  id="reward-text"
                  className="col-span-3"
                  {...form.register('title')}
                />
                <ErrorMessage
                  errors={form.formState.errors}
                  name="title"
                  render={({ message }) => (
                    <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                      {message}
                    </p>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reward-cost" className="text-right">
                  Cost
                </Label>
                <Input
                  id="reward-cost"
                  className="col-span-3"
                  {...form.register('cost', {
                    setValueAs: (value) =>
                      value === '' ? undefined : parseInt(value, 10),
                  })}
                />
                <ErrorMessage
                  errors={form.formState.errors}
                  name="cost"
                  render={({ message }) => (
                    <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                      {message}
                    </p>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
