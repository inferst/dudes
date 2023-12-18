import { Route, Routes as ReactRoutes } from 'react-router-dom';
import { PrivateRoute } from '@app/frontend-admin/components/Auth/PrivateRoute';
import { Login } from '@app/frontend-admin/components/Auth/Login';
import { useAuth } from '@app/frontend-admin/components/Auth/useAuth';
import { Layout } from '@app/frontend-admin/components/Layout/Layout';

// TODO: get rid of temp public page.
const Public = () => {
  const { user } = useAuth();

  return (
    <div>
      <code>{JSON.stringify(user, null, '\n\r')}</code>
    </div>
  );
};

export function Routes() {
  return (
    <ReactRoutes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Public />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </ReactRoutes>
  );
}
