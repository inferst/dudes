import { useUpdateUserSkinMutation } from '@app/frontend-admin/mutations/user-skins';
import { useUserSkinsQuery } from '@app/frontend-admin/queries/user-skins';
import { useTranslation } from 'react-i18next';
import { Loader } from '../../common/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { useParams } from 'react-router-dom';
import { Switch } from '../../ui/switch';

export function SkinsPage() {
  const { t } = useTranslation();
  const { id } = useParams();

  console.log('SkinsPage');

  const filters = {
    collectionId: Number(id),
  };

  const userSkinsQuery = useUserSkinsQuery(filters);

  const updateMutation = useUpdateUserSkinMutation(filters);

  const userSkins = userSkinsQuery.data ?? [];

  const handleIsActiveChange = (index: number, value: boolean) => {
    const skin = userSkins[index];

    if (skin) {
      updateMutation.mutate({ id: skin.id, isActive: value });
    }
  };

  const handleIsDefaultChange = (index: number, value: boolean) => {
    const skin = userSkins[index];

    if (skin) {
      updateMutation.mutate({ id: skin.id, isDefault: value });
    }
  };

  if (userSkinsQuery.isLoading) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('UserSkinsPage.title', {
            defaultValue: 'Skins',
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            {t('UserSkinsPage.caption', {
              defaultValue: 'A list of user skins',
            })}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                {t('UserSkinsPage.columnActive', {
                  defaultValue: 'Active',
                })}
              </TableHead>
              <TableHead className="w-[100px]">
                {t('UserSkinsPage.columnDefault', {
                  defaultValue: 'Default',
                })}
              </TableHead>
              <TableHead>
                {t('UserSkinsPage.columnName', {
                  defaultValue: 'Name',
                })}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userSkins.map((skin, index) => (
              <TableRow key={skin.id}>
                <TableCell className="font-medium">
                  <Checkbox
                    onCheckedChange={(value: boolean) =>
                      handleIsActiveChange(index, value)
                    }
                    checked={skin.isActive}
                    className="block"
                  ></Checkbox>
                </TableCell>
                <TableCell className="font-medium">
                  <Switch
                    onCheckedChange={(value: boolean) =>
                      handleIsDefaultChange(index, value)
                    }
                    checked={skin.isDefault}
                    className="block"
                  />
                </TableCell>
                <TableCell>{skin.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
