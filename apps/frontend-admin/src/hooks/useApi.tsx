import axios, { GenericAbortSignal } from 'axios';

export type User = {
  name: string;
  picture: string;
  accessToken: string;
  twitchId: string;
  userId: number;
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
