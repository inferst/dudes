import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../api/api';
import { useApiQuery } from '../api/use-api-query';

export const userSkinCollectionsKeys = createQueryKeys('userSkinCollections', {
  list: {
    queryKey: null,
    queryFn: api.getUserSkinCollections,
  },
});

export const useUserSkinCollectionsQuery = () =>
  useApiQuery({
    ...userSkinCollectionsKeys.list,
  });

export const userSkinsKeys = createQueryKeys('userSkins', {
  list: (filters: { collectionId: number }) => ({
    queryKey: [{ filters }],
    queryFn: () => api.getUserSkins({ filters }),
  }),
});

export const useUserSkinsQuery = (filters: { collectionId: number }) =>
  useApiQuery({
    ...userSkinsKeys.list(filters),
  });
