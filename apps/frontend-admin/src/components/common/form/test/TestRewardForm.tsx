import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionEntity,
  getActionableEntityFormSchema,
  testActionFormSchema,
} from '@lib/types';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { Button } from '../../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog';
import { Form } from '../../../ui/form';
import { ActionDataForm, ActionDataInput } from '../ActionDataForm';
import { useTranslation } from 'react-i18next';
import { api } from '@app/frontend-admin/api/api';

export type TestFormInput = {} & ActionDataInput;

export type TestFormProps = {
  action: ActionEntity;
} & TestFormInput;

export function TestForm(props: TestFormProps) {
  const { action, data } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const schema = getActionableEntityFormSchema(action, testActionFormSchema);

  const form = useForm<TestFormInput>({
    resolver: zodResolver(schema),
    values: {
      data,
    },
  });

  const uuid = nanoid();

  const onSubmit = (data: TestFormInput) => {
    api.testAction({
      action: action.name,
      data: data.data.action,
    });
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
          {t('TestForm.testCustomRewardButtonText', {
            defaultValue: 'Test',
          })}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form id={uuid} name={uuid} onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {t('TestForm.dialogTitle', {
                  defaultValue: 'Test reward',
                })}
              </DialogTitle>
              <DialogDescription>
                {t('TestForm.dialogDescription', {
                  defaultValue: 'Test reward here.',
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <ActionDataForm
                action={action}
                form={form as unknown as UseFormReturn<ActionDataInput>}
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {t('TestForm.submitButtonText', {
                  defaultValue: 'Submit',
                })}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
