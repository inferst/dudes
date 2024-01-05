import { UpdateUserCommandDto, UserCommandEntity, UserEntity } from '@shared';
import axios, { AxiosResponse, GenericAbortSignal } from 'axios';

type WithSignal = {
  signal?: GenericAbortSignal;
};

export const useApi = () => {
  const apiClient = axios.create({
    baseURL: '/api',
  });

  return {
    getUser: async ({ signal }: WithSignal): Promise<UserEntity> => {
      const { data } = await apiClient.get<UserEntity>('/admin/user', {
        signal,
      });

      return data;
    },
    getCommands: async ({
      signal,
    }: WithSignal): Promise<UserCommandEntity[]> => {
      const { data } = await apiClient.get<UserCommandEntity[]>(
        '/admin/command/list',
        {
          signal,
        }
      );

      return data;
    },
    updateCommand: async (
      command: UpdateUserCommandDto
    ): Promise<UserCommandEntity> => {
      const { data } = await apiClient.put<
        UserCommandEntity,
        AxiosResponse<UserCommandEntity>,
        UpdateUserCommandDto
      >('/admin/command/' + command.id, command);

      return data;
    },
  };
};
