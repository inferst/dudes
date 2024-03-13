import { ErrorMessage } from '@hookform/error-message';
import {
  ActionEntity,
  isColorUserActionEntity,
  isGrowUserActionEntity,
} from '@lib/types';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { ColorActionDataForm } from './ColorActionDataForm';

export type ActionDataInput = { data: PrismaJson.ActionableData };

export type ActionDataFormProps = {
  action: ActionEntity;
  form: UseFormReturn<ActionDataInput>;
};

export function ActionDataForm(props: ActionDataFormProps) {
  const { action, form } = props;

  if (isGrowUserActionEntity(action)) {
    return (
      <>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="reward-duration" className="text-right">
            Duration
          </Label>
          <Input
            id="reward-duration"
            className="col-span-3"
            {...form.register('data.action.duration', {
              setValueAs: (value) =>
                value === '' ? undefined : parseInt(value, 10),
            })}
          />
          <ErrorMessage
            errors={form.formState.errors}
            name="data.action.duration"
            render={({ message }) => (
              <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                {message}
              </p>
            )}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="reward-scale" className="text-right">
            Scale
          </Label>
          <Input
            id="reward-scale"
            className="col-span-3"
            {...form.register('data.action.scale', {
              setValueAs: (value) =>
                value === '' ? undefined : parseInt(value, 10),
            })}
          />
          <ErrorMessage
            errors={form.formState.errors}
            name="data.action.scale"
            render={({ message }) => (
              <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                {message}
              </p>
            )}
          />
        </div>
      </>
    );
  }

  if (isColorUserActionEntity(action)) {
    return <ColorActionDataForm form={form} />;
  }

  return;
}
