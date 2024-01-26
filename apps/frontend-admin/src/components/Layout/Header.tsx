import { useAuth } from '@app/frontend-admin/components/Auth/useAuth';
import { Button } from '../ui/button';
import { ChevronDown, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="py-2 border-b border-border/60">
      <div className="container flex items-center">
        <div className="flex items-center">
          <div className="text-primary w-10 h-10 rounded-sm overflow-hidden mr-2 ml-3">
            <img src={user?.picture} alt={user?.name} />
          </div>

          <span>Dudes</span>
        </div>
        <div className="flex flex-1 justify-end">
          <div className="flex items-center">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback>{user?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-2 my-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size={'sm'}>
                    <span>{user?.name}</span>{' '}
                    <ChevronDown className="w-4 h-4 mt-1 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <a href="/api/auth/logout">Log out</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
