import axios, { GenericAbortSignal } from 'axios';

type User = {
  name: string;
};

type WithSignal = {
  signal?: GenericAbortSignal;
};

export const useApi = () => {
  const apiClient = axios.create({
    baseURL: '/api',
  });

  return {
    getUser: async ({ signal }: WithSignal): Promise<User> => {
      const { data } = await apiClient.get<User>('/admin/user', {
        signal,
      });

      return data;
    },
  };
};
