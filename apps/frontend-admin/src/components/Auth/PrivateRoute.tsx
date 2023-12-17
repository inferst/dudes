import { useAuth } from '@app/frontend-admin/components/Auth/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

type PrivateRouteProps = {
  children: ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthorized } = useAuth();
  const location = useLocation();

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
