import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../api/api';
import { useApiQuery } from '../api/use-api-query';

export const rewardsKeys = createQueryKeys('rewards', {
  list: {
    queryKey: null,
    queryFn: api.getRewards,
  },
});

export const useRewardsQuery = () =>
  useApiQuery({
    ...rewardsKeys.list,
  });
