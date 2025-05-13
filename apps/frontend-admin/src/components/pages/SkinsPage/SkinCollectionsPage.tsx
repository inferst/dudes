import { useUserSkinCollectionsQuery } from '@/queries/user-skins';
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
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useUpdateUserSkinCollectionMutation } from '@/mutations/user-skins';
import { Switch } from '../../ui/switch';

export function SkinCollectionsPage() {
  const { t } = useTranslation();

  const userSkinCollectionsQuery = useUserSkinCollectionsQuery();
  const updateMutation = useUpdateUserSkinCollectionMutation();

  const userSkinCollections = userSkinCollectionsQuery.data ?? [];

  const handleIsActiveChange = (index: number, value: boolean) => {
    const collection = userSkinCollections[index];

    if (collection) {
      updateMutation.mutate({ id: collection.id, isActive: value });
    }
  };

  const navigate = useNavigate();

  const handleRowClick = useCallback(
    (id: number) => {
      navigate(`/admin/skins/${id}`);
    },
    [navigate]
  );

  const handleIsDefaultChange = (index: number, value: boolean) => {
    const skin = userSkinCollections[index];

    if (skin) {
      updateMutation.mutate({ id: skin.id, isDefault: value });
    }
  };

  if (userSkinCollectionsQuery.isLoading) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('UserSkinCollectionsPage.title', {
            defaultValue: 'Skin Collections',
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            {t('UserSkinCollectionsPage.caption', {
              defaultValue: 'A list of user skin collections',
            })}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                {t('UserSkinCollectionsPage.columnActive', {
                  defaultValue: 'Active',
                })}
              </TableHead>
              <TableHead className="w-[100px]">
                {t('UserSkinCollectionsPage.columnDefault', {
                  defaultValue: 'Default',
                })}
              </TableHead>
              <TableHead>
                {t('UserSkinCollectionsPage.columnName', {
                  defaultValue: 'Name',
                })}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userSkinCollections.map((collection, index) => (
              <TableRow
                key={collection.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(collection.id)}
              >
                <TableCell className="font-medium">
                  <Checkbox
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                    }}
                    onCheckedChange={(value: boolean) =>
                      handleIsActiveChange(index, value)
                    }
                    checked={collection.isActive}
                    className="block"
                  ></Checkbox>
                </TableCell>
                <TableCell className="font-medium">
                  <Switch
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                    }}
                    onCheckedChange={(value: boolean) =>
                      handleIsDefaultChange(index, value)
                    }
                    checked={collection.isDefault}
                    className="block"
                  />
                </TableCell>
                <TableCell>{collection.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
