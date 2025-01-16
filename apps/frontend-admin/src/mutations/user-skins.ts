import {
  UpdateUserSkinCollectionDto,
  UpdateUserSkinDto,
  UserSkinCollectionEntity,
  UserSkinEntity,
} from '@lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { api } from '../api/api';
import { userSkinCollectionsKeys, userSkinsKeys } from '../queries/user-skins';

export const useUpdateUserSkinCollectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserSkinCollectionEntity,
    AxiosError,
    UpdateUserSkinCollectionDto,
    UserSkinCollectionEntity[]
  >({
    mutationFn: api.updateUserSkinCollection,
    onMutate: async (data) => {
      await queryClient.cancelQueries(userSkinCollectionsKeys.list);

      const prev = queryClient.getQueryData<UserSkinCollectionEntity[]>(
        userSkinCollectionsKeys.list.queryKey
      );

      queryClient.setQueryData<UpdateUserSkinCollectionDto[]>(
        userSkinCollectionsKeys.list.queryKey,
        (collections) =>
          (collections ?? []).map((collection) =>
            collection.id === data.id ? { ...collection, ...data } : collection
          )
      );

      return prev;
    },
    onError: (_err, _collections, context) => {
      queryClient.setQueryData<UpdateUserSkinCollectionDto[]>(
        userSkinCollectionsKeys.list.queryKey,
        context ?? []
      );
    },
    onSettled: async () => {
      queryClient.invalidateQueries(userSkinCollectionsKeys.list);
    },
  });
};

export const useUpdateUserSkinMutation = (filters: {
  collectionId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    UserSkinEntity,
    AxiosError,
    UpdateUserSkinDto,
    UserSkinEntity[]
  >({
    mutationFn: api.updateUserSkin,
    onMutate: async (data) => {
      await queryClient.cancelQueries(userSkinsKeys.list(filters));

      const prev = queryClient.getQueryData<UserSkinEntity[]>(
        userSkinsKeys.list(filters).queryKey
      );

      queryClient.setQueryData<UpdateUserSkinDto[]>(
        userSkinsKeys.list(filters).queryKey,
        (skins) =>
          (skins ?? []).map((skin) =>
            skin.id === data.id ? { ...skin, ...data } : skin
          )
      );

      return prev;
    },
    onError: (_err, _skins, context) => {
      queryClient.setQueryData<UpdateUserSkinDto[]>(
        userSkinsKeys.list(filters).queryKey,
        context ?? []
      );
    },
    onSettled: async () => {
      queryClient.invalidateQueries(userSkinsKeys.list(filters));
    },
  });
};
