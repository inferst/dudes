import { Login } from '@/components/Auth/Login';
import { Layout } from '@/components/Layout/Layout';
import { Routes as ReactRoutes, Route } from 'react-router';
import { ChattersPage } from './components/pages/ChattersPage/ChattersPage';
import { CommandsPage } from './components/pages/CommandsPage/CommandsPage';
import { PreviewPage } from './components/pages/PreviewPage/PreviewPage';
import { RewardsPage } from './components/pages/RewardsPage/RewardsPage';
import { SettingsPage } from './components/pages/SettingsPage/SettingsPage';
import { SkinCollectionsPage } from './components/pages/SkinsPage/SkinCollectionsPage';
import { SkinsPage } from './components/pages/SkinsPage/SkinsPage';

export function Routes() {
  return (
    <ReactRoutes>
      <Route path="/admin" element={<Layout />}>
        <Route index element={<PreviewPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/commands" element={<CommandsPage />} />
        <Route path="/admin/rewards" element={<RewardsPage />} />
        <Route path="/admin/skins" element={<SkinCollectionsPage />} />
        <Route path="/admin/skins/:id" element={<SkinsPage />} />
        <Route path="/admin/chatters" element={<ChattersPage />} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
    </ReactRoutes>
  );
}
