import { useUpdateSettingsMutation } from '@app/frontend-admin/mutations/settings';
import { useSettingsQuery } from '@app/frontend-admin/queries/settings';
import { UpdateSettingsForm } from '@shared';
import { Loader } from '../../common/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { DudeForm } from './DudeForm';

export function DudePage() {
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
        <DudeForm data={data} onUpdate={handleFormUpdate} />
      </CardContent>
    </Card>
  );
}
