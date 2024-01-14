import { api } from '@app/frontend-admin/api/api';
import { useApiQuery } from '@app/frontend-admin/api/useApiQuery';
import { UserEntity } from '@shared';
import { ReactNode, createContext } from 'react';
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
  const {
    isLoading,
    data: user,
  } = useApiQuery({
    queryKey: ['admin/user'],
    queryFn: api.getUser,
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
