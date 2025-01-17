import { api } from '@app/frontend-admin/api/api';
import { useApiQuery } from '@app/frontend-admin/api/use-api-query';
import { UserEntity } from '@lib/types';
import { ReactNode, Suspense, createContext } from 'react';

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

  // TODO: check if not needed
  return (
    <Suspense fallback={'Loading...'}>
      <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    </Suspense>
  );
}
