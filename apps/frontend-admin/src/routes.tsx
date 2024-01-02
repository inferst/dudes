import { Route, Routes as ReactRoutes } from 'react-router-dom';
import { PrivateRoute } from '@app/frontend-admin/components/Auth/PrivateRoute';
import { Login } from '@app/frontend-admin/components/Auth/Login';
import { Layout } from '@app/frontend-admin/components/Layout/Layout';
import { PreviewPage } from './components/pages/PreviewPage/PreviewPage';
import { ChanngelPointsPage } from './components/pages/ChannelPointsPage/ChannelPointsPage';
import { HiddenUsersPage } from './components/pages/HiddenUsersPage/HiddenUsersPage';
import { DudePage } from './components/pages/DudePage/DudePage';
import { CommandsPage } from './components/pages/CommandsPage/CommandsPage';

export function Routes() {
  return (
    <ReactRoutes>
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
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
