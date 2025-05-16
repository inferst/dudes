import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionEntity,
  createTwitchRewardFormSchema,
  getActionableEntityFormSchema,
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
import { Form, FormField } from '../../ui/form';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  ActionDataForm,
  ActionDataInput,
} from '../../common/form/ActionDataForm';
import { useTranslation } from 'react-i18next';

export type AddRewardFormInput = {
  actionId: number;
  title: string;
  cost: number;
} & ActionDataInput;

export type AddRewardFormProps = {
  actions: ActionEntity[];
  onSave: (data: AddRewardFormInput) => void;
};

export function AddRewardForm(props: AddRewardFormProps) {
  const { actions, onSave } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(actions[0]);

  const schema = getActionableEntityFormSchema(
    action,
    createTwitchRewardFormSchema
  );

  const form = useForm<AddRewardFormInput>({
    resolver: zodResolver(schema),
    values: {
      title: '',
      cost: 100,
      actionId: action.id,
      data: {
        arguments: [],
        action: {},
      },
    },
  });

  const uuid = nanoid();

  const onSubmit = (data: AddRewardFormInput) => {
    onSave(data);
    setOpen(false);
  };

  const handleOpenChange = (value: boolean) => {
    if (value) {
      form.reset();
    }

    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          {t('AddRewardForm.addCustomRewardButtonText', {
            defaultValue: 'Add Custom Reward',
          })}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form id={uuid} name={uuid} onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {t('AddRewardForm.dialogTitle', {
                  defaultValue: 'Add Custom Reward',
                })}
              </DialogTitle>
              <DialogDescription>
                {t('AddRewardForm.dialogDescription', {
                  defaultValue:
                    "Make changes to reward here. Click save when you're done.",
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="actionId"
                  render={({ field }) => (
                    <>
                      <Label htmlFor="reward-action-id" className="text-right">
                        {t('AddRewardForm.actionText', {
                          defaultValue: 'Action',
                        })}
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                            setAction(
                              actions.find(
                                (action) => action.id === Number(value)
                              ) as ActionEntity
                            );
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select an action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {actions.map((action) => (
                                <SelectItem
                                  key={action.id}
                                  value={action.id.toString()}
                                >
                                  {action.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                ></FormField>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reward-text" className="text-right">
                  {t('AddRewardForm.titleText', {
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
                  {t('AddRewardForm.costText', {
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
                  type="number"
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
                {t('AddRewardForm.addRewardButtonText', {
                  defaultValue: 'Add reward',
                })}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
