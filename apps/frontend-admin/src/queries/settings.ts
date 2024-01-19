import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../api/api';
import { useApiQuery } from '../api/useApiQuery';

export const settingsKeys = createQueryKeys('settings', {
  list: {
    queryKey: null,
    queryFn: api.getSettings,
  },
});

export const useSettingsQuery = () =>
  useApiQuery({
    ...settingsKeys.list,
  });
