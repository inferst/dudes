import { useAuth } from '@/components/Auth/use-auth';
import { cn } from '@/lib/utils';
import { ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="py-2 border-b border-border/60">
      <div className="container flex items-center">
        <button
          onClick={() => navigate('/admin')}
          className={cn(
            'flex items-center',
            'rounded-md px-2 py-1',
            'bg-primary text-primary-foreground text-2xl font-medium'
          )}
        >
          <span className="block">D</span>
          <span className="block text-xl">U</span>
          <span className="block">D</span>
          <span className="block text-xl">E</span>
          <span className="block">S</span>
        </button>
        <div className="flex flex-1 justify-end">
          <div className="flex items-center">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={user?.profileImageUrl}
                alt={user?.displayName}
              />
              <AvatarFallback>{user?.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-2 my-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size={'sm'}>
                    <span>{user?.displayName}</span>{' '}
                    <ChevronDown className="w-4 h-4 mt-1 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <a href="/api/auth/logout">
                      {t('Header.logOutButtonText', {
                        defaultValue: 'Log out',
                      })}
                    </a>
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
