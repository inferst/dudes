import { SettingsEntity, UpdateSettingsDto } from '@shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { api } from '../api/api';
import { settingsKeys } from '../queries/settings';

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SettingsEntity,
    AxiosError,
    UpdateSettingsDto,
    SettingsEntity
  >({
    mutationFn: api.updateSettings,
    onMutate: async (data) => {
      await queryClient.cancelQueries(settingsKeys.list);

      const prev = queryClient.getQueryData<SettingsEntity>(
        settingsKeys.list.queryKey
      );

      queryClient.setQueryData<UpdateSettingsDto>(
        settingsKeys.list.queryKey,
        (settings) => data
      );

      return prev;
    },
    onError: (_err, _commands, context) => {
      queryClient.setQueryData<UpdateSettingsDto>(
        settingsKeys.list.queryKey,
        context
      );
    },
  });
};
