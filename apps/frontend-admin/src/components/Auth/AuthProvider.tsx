import { api } from '@app/frontend-admin/api/api';
import { useApiQuery } from '@app/frontend-admin/api/useApiQuery';
import { UserEntity } from '@lib/types';
import { ReactNode, createContext } from 'react';

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
    return;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
