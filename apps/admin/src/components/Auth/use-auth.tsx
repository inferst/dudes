import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('AuthContext must be attached.');
  }

  return ctx;
};
