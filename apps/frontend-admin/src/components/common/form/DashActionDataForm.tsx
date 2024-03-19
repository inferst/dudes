import { ErrorMessage } from '@hookform/error-message';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

export type ActionDataInput = { data: PrismaJson.ActionableData };

export type DashActionDataFormProps = {
  form: UseFormReturn<ActionDataInput>;
};

export function DashActionDataForm(props: DashActionDataFormProps) {
  const { form } = props;

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="jump-force" className="text-right">
        Force
      </Label>
      <Input
        id="jump-force"
        className="col-span-3"
        {...form.register('data.action.force', {
          setValueAs: (value) => (value === '' ? undefined : Number(value)),
        })}
      />
      <ErrorMessage
        errors={form.formState.errors}
        name="data.action.force"
        render={({ message }) => (
          <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
            {message}
          </p>
        )}
      />
    </div>
  );
}
