import { zodResolver } from '@hookform/resolvers/zod';
import {
  UpdateSettingsDto,
  UpdateSettingsForm,
  updateSettingsDtoSchema,
} from '@repo/types';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '../../ui/form';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Separator } from '../../ui/separator';
import { useTranslation } from 'react-i18next';
import { Input } from '../../ui/input';

type FormInput = UpdateSettingsDto;

export type SettingsFormProps = {
  data: UpdateSettingsForm;
  onUpdate: (data: UpdateSettingsForm) => void;
};

export function SettingsForm(props: SettingsFormProps) {
  const form = useForm<FormInput>({
    resolver: zodResolver(updateSettingsDtoSchema),
    values: props.data,
  });

  const { t } = useTranslation();

  const handleSubmit = form.handleSubmit(
    (data) => {
      props.onUpdate(data);
    },
    (error) => {
      console.log('invalid: ', error);
    }
  );

  return (
    <Form {...form}>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {t('SettingsForm.globalTitle', { defaultValue: 'Global' })}
      </h4>
      <Separator className="my-4" />
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>
          <Label htmlFor="fallingEvotars" className="text-xl">
            {t('SettingsForm.fallingEvotarsText', {
              defaultValue: 'Falling evotars',
            })}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t('SettingsForm.fallingEvotarsDescription', {
              defaultValue: 'Drop dude in the top of screen',
            })}
          </p>
        </div>
        <div className="col-span-3">
          <FormField
            control={form.control}
            name={'fallingEvotars'}
            render={({ field }) => {
              return (
                <Switch
                  {...field}
                  id="fallingEvotars"
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    handleSubmit();
                  }}
                  checked={field.value}
                  value={`${field.value}`}
                ></Switch>
              );
            }}
          ></FormField>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>
          <Label htmlFor="showAnonymousEvotars" className="text-xl">
            {t('SettingsForm.spawnAnonymousViewersText', {
              defaultValue: 'Spawn anonymous viewers',
            })}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t('SettingsForm.spawnAnonymousViewersDescription', {
              defaultValue:
                "Viewers who don't chat will be spawned without names",
            })}
          </p>
        </div>
        <div className="col-span-3">
          <FormField
            control={form.control}
            name={'showAnonymousEvotars'}
            render={({ field }) => {
              return (
                <Switch
                  {...field}
                  id="showAnonymousEvotars"
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    handleSubmit();
                  }}
                  checked={field.value}
                  value={`${field.value}`}
                ></Switch>
              );
            }}
          ></FormField>
        </div>
      </div>
      <Separator className="mt-4 mb-8" />
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {t('SettingsForm.raidTitle', {
          defaultValue: 'Raid',
        })}
      </h4>
      <Separator className="my-4" />
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>
          <Label htmlFor="fallingRaiders" className="text-xl">
            {t('SettingsForm.fallingRaidersText', {
              defaultValue: 'Falling raiders',
            })}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t('SettingsForm.fallingRaidersDescription', {
              defaultValue: 'Drop raiders in the top of screen',
            })}
          </p>
        </div>
        <div className="col-span-3">
          <FormField
            control={form.control}
            name={'fallingRaiders'}
            render={({ field }) => {
              return (
                <Switch
                  {...field}
                  id="fallingRaiders"
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    handleSubmit();
                  }}
                  checked={field.value}
                  value={`${field.value}`}
                ></Switch>
              );
            }}
          ></FormField>
        </div>
      </div>
      <Separator className="mt-4 mb-8" />
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {t('SettingsForm.usersTitle', {
          defaultValue: 'Users',
        })}
      </h4>
      <Separator className="my-4" />
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>
          <Label htmlFor="hiddenUsers" className="text-xl">
            {t('SettingsForm.hiddenUsersText', {
              defaultValue: 'Hidden Users',
            })}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t('SettingsForm.hiddenUsersDescription', {
              defaultValue: 'Hidden Users',
            })}
          </p>
        </div>
        <div className="col-span-3">
          <FormField
            control={form.control}
            name={'hiddenUsers'}
            render={() => {
              return (
                <Input
                  id="hiddenUsers"
                  {...form.register('hiddenUsers')}
                  onBlur={handleSubmit}
                />
              );
            }}
          ></FormField>
        </div>
      </div>
      <Separator className="mt-4 mb-8" />
    </Form>
  );
}
