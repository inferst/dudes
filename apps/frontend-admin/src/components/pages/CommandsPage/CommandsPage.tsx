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


import { useUpdateCommandMutation } from '@app/frontend-admin/mutations/commands';
import { useCommndsQuery } from '@app/frontend-admin/queries/commands';
import { Loader } from '../../common/Loader';

export function CommandsPage() {
  const { isLoading, data} = useCommndsQuery();

  const commands = data ?? [];

  const mutation = useUpdateCommandMutation();

  if (isLoading) {
    return <Loader />;
  }

  const handleIsActiveChange = (index: number, value: boolean) => {
    const command = commands[index];

    if (command) {
      mutation.mutate({ id: command.id, isActive: value });
    }
  };

  const handleCommandSave = (index: number, data: CommandFormInput) => {
    const command = commands[index];

    if (command) {
      mutation.mutate({
        id: command.id,
        text: data.text,
        cooldown: data.cooldown,
      });
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
