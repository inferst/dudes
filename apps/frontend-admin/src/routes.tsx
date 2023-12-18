import { Route, Routes as ReactRoutes } from 'react-router-dom';
import { PrivateRoute } from '@app/frontend-admin/components/Auth/PrivateRoute';
import { Login } from '@app/frontend-admin/components/Auth/Login';
import { useAuth } from '@app/frontend-admin/components/Auth/useAuth';

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
            <Public />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
    </ReactRoutes>
  );
}
