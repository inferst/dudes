import { ErrorMessage } from '@hookform/error-message';
import { UseFormReturn } from 'react-hook-form';
import { FormField } from '../../ui/form';
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
import { useTranslation } from 'react-i18next';

export type ActionDataInput = { data: PrismaJson.ActionableData };

export type AddJumpHitsActionDataFormProps = {
  form: UseFormReturn<ActionDataInput>;
};

type PropType = 'argument' | 'value';

export function AddJumpHitsActionDataForm(
  props: AddJumpHitsActionDataFormProps
) {
  const { form } = props;

  const { t } = useTranslation();

  const getPropType = (value: string[]): PropType =>
    value?.includes('count') ? 'argument' : 'value';

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="reward-sprite" className="text-right">
        {t('AddJumpHitsActionDataForm.addJumpHitsText', {
          defaultValue: 'Jumps',
        })}
      </Label>

      <FormField
        control={form.control}
        name="data.arguments"
        render={({ field }) => (
          <>
            <Select
              value={getPropType(field.value)}
              onValueChange={(value) => {
                if (value === 'argument') {
                  field.onChange(['count']);
                } else {
                  field.onChange([]);
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'argument'}>
                    {t('AddJumpHitsActionDataForm.userArgumentText', {
                      defaultValue: 'User argument',
                    })}
                  </SelectItem>
                  <SelectItem value={'value'}>
                    {t('AddJumpHitsActionDataForm.valueText', {
                      defaultValue: 'Value',
                    })}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {getPropType(field.value) === 'value' && (
              <>
                <Input
                  id="reward-add-jump-hits"
                  type="number"
                  className="col-start-2 col-span-3"
                  {...form.register('data.action.count', {
                    setValueAs: (value) =>
                      value === '' ? undefined : parseInt(value, 10),
                  })}
                />
                <ErrorMessage
                  errors={form.formState.errors}
                  name="data.action.count"
                  render={({ message }) => (
                    <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                      {message}
                    </p>
                  )}
                />
              </>
            )}
          </>
        )}
      />
    </div>
  );
}
