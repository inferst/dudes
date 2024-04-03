import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionEntity,
  getActionableEntityFormSchema,
  updateCommandFormSchema,
} from '@lib/types';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
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
import {
  ActionDataForm,
  ActionDataInput,
} from '../../common/form/ActionDataForm';
import { useTranslation } from 'react-i18next';

export type CommandFormInput = {
  text: string;
  cooldown: number;
} & ActionDataInput;

type CommandFormProps = {
  action: ActionEntity;
  onSave: (data: CommandFormInput) => void;
} & CommandFormInput;

export function CommandForm(props: CommandFormProps) {
  const { text, cooldown, data, action, onSave } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const schema = getActionableEntityFormSchema(action, updateCommandFormSchema);

  const form = useForm<CommandFormInput>({
    resolver: zodResolver(schema),
    values: {
      text,
      cooldown,
      data,
    },
  });

  const uuid = nanoid();

  const onSubmit = (data: CommandFormInput) => {
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
        <Button variant="secondary">{t('pages.Commands.edit')}</Button>
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
                <Label htmlFor="command-text" className="text-right">
                  Text
                </Label>
                <Input
                  id="command-text"
                  className="col-span-3"
                  {...form.register('text')}
                />
                <ErrorMessage
                  errors={form.formState.errors}
                  name="text"
                  render={({ message }) => (
                    <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                      {message}
                    </p>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="command-cooldown" className="text-right">
                  Cooldown
                </Label>
                <Input
                  id="command-cooldown"
                  type="number"
                  min={0}
                  className="col-span-3"
                  {...form.register('cooldown', {
                    setValueAs: (value) =>
                      value === '' ? 0 : parseInt(value, 10),
                  })}
                />
                <ErrorMessage
                  errors={form.formState.errors}
                  name="cooldown"
                  render={({ message }) => (
                    <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                      {message}
                    </p>
                  )}
                />
              </div>
              <ActionDataForm
                action={action}
                form={form as unknown as UseFormReturn<ActionDataInput>}
              />
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
