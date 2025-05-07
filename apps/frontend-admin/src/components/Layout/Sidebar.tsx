import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

type NavLink = {
  path: string;
  title: string;
  isDisabled?: boolean;
};

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const links: NavLink[] = [
    {
      path: '/admin',
      title: t('Sidebar.previewText', {
        defaultValue: 'Preview',
      }),
    },
    {
      path: '/admin/settings',
      title: t('Sidebar.settingsText', {
        defaultValue: 'Settings',
      }),
    },
    {
      path: '/admin/commands',
      title: t('Sidebar.commandsText', {
        defaultValue: 'Commands',
      }),
    },
    {
      path: '/admin/rewards',
      title: t('Sidebar.rewardsText', {
        defaultValue: 'Twitch Rewards',
      }),
    },
    {
      path: '/admin/skins',
      title: t('Sidebar.skinsText', {
        defaultValue: 'Skins',
      }),
    },
    {
      path: '/admin/chatters',
      title: t('Sidebar.chattersText', {
        defaultValue: 'Chatters',
      }),
    },
    // {
    //   path: '/admin/donations',
    //   title: t('Sidebar.donationsText', {
    //     defaultValue: 'Donations',
    //   }),
    //   isDisabled: true,
    // },
  ];

  const handleLinkClick = (link: NavLink) => {
    navigate(link.path);
  };

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
