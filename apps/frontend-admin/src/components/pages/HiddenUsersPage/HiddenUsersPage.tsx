import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableRow } from '../../ui/table';

type User = {
  id: number;
  name: string;
};

export function HiddenUsersPage() {
  const [userInput, setUserInput] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const handleAddUserClick = () => {
    const value = userInput;

    if (users.some((user) => user.name === value)) {
      setUserInput('');
      return;
    }

    if (value !== '') {
      setUsers([...users, { id: users.length, name: value }]);
      setUserInput('');
    }
  };

  const handleRemoveUserClick = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hidden Users</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Add users to the list if you want not to show the dude</p>
        <p className="text-sm text-muted-foreground">
          It can be useful to hide bots on your stream
        </p>
        <div className="mt-4 flex">
          <Input
            name="value"
            type="text"
            value={userInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setUserInput(event.target.value)
            }
            className="max-w-72 mr-4"
          ></Input>
          <Button onClick={handleAddUserClick} disabled={userInput === ''}>
            <Plus className="h-5 w-5 mr-2"></Plus> Add user
          </Button>
        </div>
        <Table className="mt-6">
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.name}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleRemoveUserClick(user.id)}
                    variant="secondary"
                  >
                    Remove
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
