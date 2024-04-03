import { useUpdateSettingsMutation } from '@app/frontend-admin/mutations/settings';
import { useSettingsQuery } from '@app/frontend-admin/queries/settings';
import { UpdateSettingsForm } from '@lib/types';
import { Loader } from '../../common/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { SettingsForm } from './SettingsForm';
import { useTranslation } from 'react-i18next';

export function SettingsPage() {
  const settingsQuery = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

  const { t } = useTranslation();

  const data = settingsQuery.data;

  const handleFormUpdate = (data: UpdateSettingsForm) => {
    updateMutation.mutate(data);
  };

  if (!data || settingsQuery.isLoading) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.Settings.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsForm data={data} onUpdate={handleFormUpdate} />
      </CardContent>
    </Card>
  );
}
