import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../api/api';
import { useApiQuery } from '../api/useApiQuery';

export const actionsKeys = createQueryKeys('actions', {
  list: {
    queryKey: null,
    queryFn: api.getActions,
  },
});

export const useActionsQuery = () =>
  useApiQuery({
    ...actionsKeys.list,
  });
