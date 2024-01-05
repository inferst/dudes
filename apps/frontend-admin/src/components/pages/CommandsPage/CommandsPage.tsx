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
import { CommandForm } from './CommandForm';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useApi } from '@app/frontend-admin/hooks/useApi';
import { AxiosError, isAxiosError } from 'axios';

import { useNavigate } from 'react-router-dom';

import { UpdateUserCommandDto, UserCommandEntity } from '@shared';
import { Loader } from '../../common/Loader';

export function CommandsPage() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { getCommands, updateCommand } = useApi();

  const { isLoading, data } = useQuery<UserCommandEntity[]>(
    'admin/command/list',
    getCommands,
    {
      refetchOnWindowFocus: false,
      retry: false,
      initialData: [],
      onError: (err) => {
        if (isAxiosError(err) && err?.response?.status === 403) {
          navigate('/admin/login');
        }
      },
    }
  );

  const commands = data ?? [];

  const mutation = useMutation<
    UserCommandEntity,
    AxiosError,
    UpdateUserCommandDto,
    UserCommandEntity[]
  >({
    mutationFn: updateCommand,
    onMutate: async (data) => {
      await queryClient.cancelQueries('admin/command/list');

      const prev =
        queryClient.getQueryData<UserCommandEntity[]>('admin/command/list');

      queryClient.setQueryData<UpdateUserCommandDto[]>(
        ['admin/command/list'],
        (commands) =>
          (commands ?? []).map((command) =>
            command.id === data.id ? { ...command, ...data } : command
          )
      );

      return prev;
    },
    onError: (_err, _commands, context) => {
      queryClient.setQueryData<UpdateUserCommandDto[]>(
        'admin/command/list',
        context ?? []
      );
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  const handleIsActiveChange = (index: number, value: boolean) => {
    const command = commands[index];

    if (command) {
      mutation.mutate({ ...command, isActive: value });
    }
  };

  const handleCommandSave = (index: number, data: UpdateUserCommandDto) => {
    const command = commands[index];

    if (command) {
      mutation.mutate({ ...command, ...data });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commands</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of dude commands</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead>Command</TableHead>
              <TableHead>Cooldown</TableHead>
              <TableHead className="w-40">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commands.map((command, index) => (
              <TableRow key={command.id}>
                <TableCell className="font-medium">
                  <Checkbox
                    onCheckedChange={(value: boolean) =>
                      handleIsActiveChange(index, value)
                    }
                    checked={command.isActive}
                    className="block"
                  ></Checkbox>
                </TableCell>
                <TableCell>{command.text}</TableCell>
                <TableCell>{command.cooldown}</TableCell>
                <TableCell>
                  <CommandForm
                    text={command.text}
                    cooldown={command.cooldown}
                    onSave={(data) => handleCommandSave(index, data)}
                  ></CommandForm>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
