import { useForm } from 'react-hook-form';
import { Form, FormField } from '../../ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { nanoid } from 'nanoid';

type FormInput = {
  text: string;
  cooldown: number;
};

export function CommandForm({
  text,
  cooldown,
}: {
  text: string;
  cooldown: number;
}) {
  const form = useForm<FormInput>({
    defaultValues: {
      text,
      cooldown,
    },
  });

  const onSubmit = (data: FormInput) => {
    console.log(data);
  };

  const uuid = nanoid();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form id={uuid} name={uuid} onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit command</DialogTitle>
              <DialogDescription>
                Make changes to command here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <>
                      <Label htmlFor="command-text" className="text-right">
                        Text
                      </Label>
                      <Input
                        id="command-text"
                        className="col-span-3"
                        {...field}
                      />
                    </>
                  )}
                ></FormField>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="cooldown"
                  render={({ field }) => (
                    <>
                      <Label htmlFor="command-cooldown" className="text-right">
                        Cooldown
                      </Label>
                      <Input
                        id="command-cooldown"
                        type="number"
                        className="col-span-3"
                        {...field}
                      />
                    </>
                  )}
                ></FormField>
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
