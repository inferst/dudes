import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateChatterForm, createChatterFormSchema } from '@lib/types';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Form, FormField } from '../../ui/form';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from '../../ui/table';
import { useChattersQuery } from '@app/frontend-admin/queries/chatters';
import {
  useCreateChatterMutation,
  useDeleteChatterMutation,
} from '@app/frontend-admin/mutations/chatters';
import { Loader } from '../../common/Loader';

export function SkinsPage() {
  const { t } = useTranslation();

  const sprites = ['agent', 'sith', 'cat', 'girl', 'senior', 'nerd', 'sponge'];

  const form = useForm<CreateChatterForm>({
    resolver: zodResolver(createChatterFormSchema),
    defaultValues: {
      sprite: 'agent',
    },
  });

  const [isError, setIsError] = useState(false);

  const chattersQuery = useChattersQuery();

  const chatters = chattersQuery.data ?? [];

  const createMutation = useCreateChatterMutation();
  const deleteMutation = useDeleteChatterMutation();

  if (chattersQuery.isLoading) {
    return <Loader />;
  }

  const uuid = nanoid();

  const onSubmit = (data: CreateChatterForm) => {
    if (chatters.some((chatter) => chatter.chatterId === data.chatterId)) {
      setIsError(true);
    } else {
      createMutation.mutate(data);
      form.setValue('chatterId', '');
      setIsError(false);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('SkinsPage.title', { defaultValue: 'Skins' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id={uuid} name={uuid} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chatter-name" className="text-right">
                {t('SkinsPage.chatterIdText', {
                  defaultValue: 'Chatter id',
                })}
              </Label>
              <div className="col-span-2">
                <Input
                  id="chatter-name"
                  className="col-span-3"
                  {...form.register('chatterId')}
                />
              </div>
              <ErrorMessage
                errors={form.formState.errors}
                name="chatterId"
                render={({ message }) => (
                  <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                    {message}
                  </p>
                )}
              />
              {isError && (
                <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                  Chatter already exists
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-4">
              <Label htmlFor="chatter-sprite" className="text-right">
                {t('SkinsPage.spriteText', {
                  defaultValue: 'Sprite',
                })}
              </Label>
              <FormField
                control={form.control}
                name="sprite"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {sprites.map((sprite) => (
                          <SelectItem key={sprite} value={sprite}>
                            {sprite}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              ></FormField>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-4">
              <div className="col-start-2">
                <Button type="submit">
                  {t('SkinsPage.addChatterSkinButtonText', {
                    defaultValue: 'Add',
                  })}
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <Table className="mt-4">
          <TableCaption>
            {t('SkinsPage.caption', {
              defaultValue: 'A list of chatters',
            })}
          </TableCaption>
          <TableBody>
            {chatters.map((chatter, index) => (
              <TableRow key={chatter.chatterId}>
                <TableCell className="w-20">{index + 1}</TableCell>
                <TableCell>{chatter.chatterId}</TableCell>
                <TableCell>{chatter.sprite}</TableCell>
                <TableCell>
                  <Button
                    variant={'secondary'}
                    onClick={() => handleDelete(chatter.id)}
                  >
                    {t('SkinsPage.deleteButtonText', {
                      defaultValue: 'Delete',
                    })}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
