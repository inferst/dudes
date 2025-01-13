import { Login } from '@app/frontend-admin/components/Auth/Login';
import { Layout } from '@app/frontend-admin/components/Layout/Layout';
import { Routes as ReactRoutes, Route } from 'react-router-dom';
import { RewardsPage } from './components/pages/RewardsPage/RewardsPage';
import { CommandsPage } from './components/pages/CommandsPage/CommandsPage';
import { SettingsPage } from './components/pages/SettingsPage/SettingsPage';
import { PreviewPage } from './components/pages/PreviewPage/PreviewPage';
import { ChattersPage } from './components/pages/ChattersPage/ChattersPage';

export function Routes() {
  return (
    <ReactRoutes>
      <Route path="/admin" element={<Layout />}>
        <Route index element={<PreviewPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/commands" element={<CommandsPage />} />
        <Route path="/admin/rewards" element={<RewardsPage />} />
        <Route path="/admin/chatters" element={<ChattersPage />} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
    </ReactRoutes>
  );
}
