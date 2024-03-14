import { ErrorMessage } from '@hookform/error-message';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

export type ActionDataInput = { data: PrismaJson.ActionableData };

export type JumpActionDataFormProps = {
  form: UseFormReturn<ActionDataInput>;
};

export function JumpActionDataForm(props: JumpActionDataFormProps) {
  const { form } = props;

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="jump-velocity-x" className="text-right">
          Velocity X
        </Label>
        <Input
          id="jump-velocity-x"
          className="col-span-3"
          {...form.register('data.action.velocityX', {
            setValueAs: (value) =>
              value === '' ? undefined : Number(value),
          })}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="data.action.velocityX"
          render={({ message }) => (
            <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
              {message}
            </p>
          )}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="jump-velocity-y" className="text-right">
          Velocity Y
        </Label>
        <Input
          id="jump-velocity-y"
          className="col-span-3"
          {...form.register('data.action.velocityY', {
            setValueAs: (value) =>
              value === '' ? undefined : Number(value),
          })}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="data.action.velocityY"
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
