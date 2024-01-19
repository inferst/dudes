import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

type NavLink = {
  path: string;
  title: string;
  isDisabled?: boolean;
};

const links: NavLink[] = [
  {
    path: '/admin',
    title: 'Preview',
  },
  {
    path: '/admin/settings',
    title: 'Settings',
  },
  {
    path: '/admin/commands',
    title: 'Commands',
  },
  {
    path: '/admin/rewards',
    title: 'Rewards',
  },
  {
    path: '/admin/skins',
    title: 'Skins',
    isDisabled: true,
  },
  {
    path: '/admin/donations',
    title: 'Donations',
    isDisabled: true,
  },
  {
    path: '/admin/hidden-users',
    title: 'Hidden Users',
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (link: NavLink) => {
    navigate(link.path);
  }

  return (
    <aside className="pt-10 w-60">
      <ul>
        {links.map((link) => {
          return (
            <li key={link.path}>
              <Button
                size={'sm'}
                variant={location.pathname === link.path ? 'outline' : 'ghost'}
                onClick={() => handleLinkClick(link)}
                disabled={link.isDisabled}
                className="w-full justify-start rounded-sm"
              >
                {link.title}
              </Button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
