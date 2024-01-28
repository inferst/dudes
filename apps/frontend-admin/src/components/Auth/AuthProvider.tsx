import { api } from '@app/frontend-admin/api/api';
import { useApiQuery } from '@app/frontend-admin/api/useApiQuery';
import { UserEntity } from '@shared';
import { ReactNode, createContext } from 'react';
import { Loader } from '../common/Loader';

type AuthContext = {
  user?: UserEntity;
};

export const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    isLoading,
    isError,
    data: user,
    error,
  } = useApiQuery({
    queryKey: ['admin/user'],
    queryFn: api.getUser,
  });

  // TODO: implement error boundary component
  if (isError) {
    return error.message;
  }

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
