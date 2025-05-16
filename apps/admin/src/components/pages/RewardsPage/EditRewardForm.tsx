import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionEntity,
  getActionableEntityFormSchema,
  updateTwitchRewardFormSchema,
} from '@repo/types';
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

export type EditRewardFormInput = {
  title: string;
  cost: number;
} & ActionDataInput;

export type EditRewardFormProps = {
  action: ActionEntity;
  onSave: (data: EditRewardFormInput) => void;
} & EditRewardFormInput;

export function EditRewardForm(props: EditRewardFormProps) {
  const { title, cost, action, data, onSave } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const schema = getActionableEntityFormSchema(
    action,
    updateTwitchRewardFormSchema
  );

  const form = useForm<EditRewardFormInput>({
    resolver: zodResolver(schema),
    values: {
      title,
      cost,
      data,
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
        <Button variant="secondary">
          {t('EditRewardForm.editCustomRewardButtonText', {
            defaultValue: 'Edit',
          })}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form id={uuid} name={uuid} onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {t('EditRewardForm.dialogTitle', {
                  defaultValue: 'Edit reward',
                })}
              </DialogTitle>
              <DialogDescription>
                {t('EditRewardForm.dialogDescription', {
                  defaultValue:
                    "Make changes to reward here. Click save when you're done.",
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reward-text" className="text-right">
                  {t('EditRewardForm.titleText', {
                    defaultValue: 'Title',
                  })}
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
                  {t('EditRewardForm.costText', {
                    defaultValue: 'Cost',
                  })}
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
              <ActionDataForm
                action={action}
                form={form as unknown as UseFormReturn<ActionDataInput>}
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {t('EditRewardForm.saveButtonText', {
                  defaultValue: 'Save changes',
                })}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
