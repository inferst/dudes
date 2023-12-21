import { Route, Routes as ReactRoutes } from 'react-router-dom';
import { PrivateRoute } from '@app/frontend-admin/components/Auth/PrivateRoute';
import { Login } from '@app/frontend-admin/components/Auth/Login';
import { Layout } from '@app/frontend-admin/components/Layout/Layout';
import { HomePage } from '@app/frontend-admin/components/HomePage/HomePage';

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
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
    </ReactRoutes>
  );
}
