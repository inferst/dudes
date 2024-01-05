import { createContext, ReactNode } from 'react';
import { useApi } from '@app/frontend-admin/hooks/useApi';
import { useQuery } from 'react-query';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserEntity } from '@shared';
import { Loader } from '../common/Loader';

type AuthContext = {
  user?: UserEntity;
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
    refetchOnWindowFocus: false,
    retry: false,
    onError: (err) => {
      if (isAxiosError(err) && err?.response?.status === 403) {
        navigate('/admin/login');
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader></Loader>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthorized: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
