import { useState } from 'react';
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

type Command = {
  id: string;
  text: string;
  description: string;
  isActive: boolean;
  cooldown: number;
};

export function CommandsPage() {
  const [commands, setCommands] = useState<Command[]>([
    {
      id: 'jump',
      text: '!jump',
      description: 'Jump',
      isActive: true,
      cooldown: 0,
    },
    {
      id: 'color',
      text: '!color {color}',
      description: 'Change color',
      isActive: false,
      cooldown: 5,
    },
  ]);

  const handleIsActiveChange = (index: number, value: boolean) => {
    const updated = [...commands];
    updated[index].isActive = value;
    setCommands(updated);
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
              <TableHead>Description</TableHead>
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
                <TableCell>{command.description}</TableCell>
                <TableCell>
                  <CommandForm
                    text={command.text}
                    cooldown={command.cooldown}
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
