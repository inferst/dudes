import { useUpdateSettingsMutation } from '@app/frontend-admin/mutations/settings';
import { useSettingsQuery } from '@app/frontend-admin/queries/settings';
import { UpdateSettingsForm } from '@libs/types';
import { Loader } from '../../common/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { SettingsForm } from './SettingsForm';

export function SettingsPage() {
  const settingsQuery = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

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
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsForm data={data} onUpdate={handleFormUpdate} />
      </CardContent>
    </Card>
  );
}
