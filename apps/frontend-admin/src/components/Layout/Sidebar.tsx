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
    path: '/admin/dude',
    title: 'Dude Show/Hide',
  },
  {
    path: '/admin/commands',
    title: 'Commands',
  },
  {
    path: '/admin/channel-points',
    title: 'Channel Points',
  },
  {
    path: '/admin/skins',
    title: 'Skins',
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
