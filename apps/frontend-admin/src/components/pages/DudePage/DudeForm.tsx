import { zodResolver } from '@hookform/resolvers/zod';
import {
  UpdateSettingsDto,
  UpdateSettingsForm,
  updateSettingsDtoSchema,
} from '@shared';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '../../ui/form';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';

type FormInput = UpdateSettingsDto;

export type DudeFormProps = {
  data: UpdateSettingsForm;
  onUpdate: (data: UpdateSettingsForm) => void;
};

export function DudeForm(props: DudeFormProps) {
  const form = useForm<FormInput>({
    resolver: zodResolver(updateSettingsDtoSchema),
    values: props.data,
  });

  const handleSubmit = form.handleSubmit(
    (data) => {
      props.onUpdate(data);
    },
    (error) => {
      console.log('invalid: ', error);
    }
  );

  useEffect(() => {
    const watcher = form.watch((data) => {
      handleSubmit();
    });

    return () => watcher.unsubscribe();
  }, [form, handleSubmit]);

  return (
    <Form {...form}>
      <div className="flex items-center space-x-2 mt-4">
        <FormField
          control={form.control}
          name={'fallingDudes'}
          render={({ field }) => {
            return (
              <>
                <Switch
                  {...field}
                  id="fallingDudes"
                  onCheckedChange={(value) => {
                    field.onChange(value);
                  }}
                  checked={field.value}
                  value={`${field.value}`}
                ></Switch>
                <Label htmlFor="fallingDudes">Falling dudes</Label>
              </>
            );
          }}
        ></FormField>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <FormField
          control={form.control}
          name={'showAnonymousDudes'}
          render={({ field }) => {
            return (
              <>
                <Switch
                  {...field}
                  id="showAnonymousDudes"
                  onCheckedChange={(value) => {
                    field.onChange(value);
                  }}
                  checked={field.value}
                  value={`${field.value}`}
                ></Switch>
                <Label htmlFor="showAnonymousDudes">Show anonymous dudes</Label>
              </>
            );
          }}
        ></FormField>
      </div>
    </Form>
  );
}
