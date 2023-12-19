import { createContext, ReactNode } from 'react';
import { useApi } from '@app/frontend-admin/hooks/useApi';
import { useQuery } from 'react-query';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { User } from '@dudes/shared';

type AuthContext = {
  user?: User;
  isAuthorized: boolean;
};

export const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { getUser } = useApi();
  const navigate = useNavigate();
  const { isLoading, data: user } = useQuery('admin/user', getUser, {
    retry: false,
    onError: (err) => {
      if (isAxiosError(err) && err?.response?.status === 403) {
        navigate('/login');
      }
    },
  });

  if (isLoading) {
    return <div>{'Loading...'}</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthorized: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
