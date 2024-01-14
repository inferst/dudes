import { Login } from '@app/frontend-admin/components/Auth/Login';
import { Layout } from '@app/frontend-admin/components/Layout/Layout';
import { Routes as ReactRoutes, Route } from 'react-router-dom';
import { ChanngelPointsPage } from './components/pages/ChannelPointsPage/ChannelPointsPage';
import { CommandsPage } from './components/pages/CommandsPage/CommandsPage';
import { DudePage } from './components/pages/DudePage/DudePage';
import { HiddenUsersPage } from './components/pages/HiddenUsersPage/HiddenUsersPage';
import { PreviewPage } from './components/pages/PreviewPage/PreviewPage';

export function Routes() {
  return (
    <ReactRoutes>
      <Route path="/admin" element={<Layout />}>
        <Route index element={<PreviewPage />} />
        <Route path="/admin/dude" element={<DudePage />} />
        <Route path="/admin/commands" element={<CommandsPage />} />
        <Route path="/admin/channel-points" element={<ChanngelPointsPage />} />
        <Route path="/admin/hidden-users" element={<HiddenUsersPage />} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
    </ReactRoutes>
  );
}
