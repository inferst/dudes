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

export type SpriteActionDataFormProps = {
  form: UseFormReturn<ActionDataInput>;
};

type PropType = 'argument' | 'value';

export function SpriteActionDataForm(props: SpriteActionDataFormProps) {
  const { form } = props;

  const { t } = useTranslation();

  const getPropType = (value: string[]): PropType =>
    value?.includes('sprite') ? 'argument' : 'value';

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="reward-sprite" className="text-right">
        {t('SpriteActionDataForm.spriteText', { defaultValue: 'Sprite' })}
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
                  field.onChange(['sprite']);
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
                    {t('SpriteActionDataForm.userArgumentText', {
                      defaultValue: 'User argument',
                    })}
                  </SelectItem>
                  <SelectItem value={'value'}>
                    {t('SpriteActionDataForm.valueText', {
                      defaultValue: 'Value',
                    })}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {getPropType(field.value) === 'value' && (
              <>
                <Input
                  id="reward-sprite"
                  className="col-start-2 col-span-3"
                  {...form.register('data.action.sprite')}
                />
                <ErrorMessage
                  errors={form.formState.errors}
                  name="data.action.sprite"
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
