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
import { CommandForm, CommandFormInput } from './CommandForm';

import {
  useUpdateCommandMutation
} from '@app/frontend-admin/mutations/commands';
import { useActionsQuery } from '@app/frontend-admin/queries/actions';
import { useCommndsQuery } from '@app/frontend-admin/queries/commands';
import { CommandEntity } from '@shared';
import { Loader } from '../../common/Loader';

export function CommandsPage() {
  const actionsQuery = useActionsQuery();
  const commandsQuery = useCommndsQuery();

  const commands = commandsQuery.data ?? [];
  const actions = actionsQuery.data ?? [];

  const updateMutation = useUpdateCommandMutation();

  if (commandsQuery.isLoading || actionsQuery.isLoading) {
    return <Loader />;
  }

  const handleIsActiveChange = (index: number, value: boolean) => {
    const command = commands[index];

    if (command) {
      updateMutation.mutate({ id: command.id, isActive: value });
    }
  };

  const handleCommandSave = (index: number, data: CommandFormInput) => {
    const command = commands[index];

    if (command) {
      updateMutation.mutate({
        id: command.id,
        text: data.text,
        cooldown: data.cooldown,
        data: data.data,
      });
    }
  };

  const commandForm = (command: CommandEntity, index: number) => {
    const action = actions.find((action) => action.id === command.actionId);

    if (action) {
      return (
        <CommandForm
          text={command.text}
          cooldown={command.cooldown}
          action={action}
          data={command.data}
          onSave={(data) => handleCommandSave(index, data)}
        ></CommandForm>
      );
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
              <TableHead className="w-[100px]">Command</TableHead>
              <TableHead>Cooldown</TableHead>
              <TableHead className="w-[10px]"></TableHead>
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
                <TableCell>{commandForm(command, index)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
