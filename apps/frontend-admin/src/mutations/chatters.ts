import { ChatterEntity, CreateChatterDto } from "@lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../api/api";
import { chattersKeys } from "../queries/chatters";

export const useCreateChatterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatterEntity, AxiosError, CreateChatterDto, ChatterEntity[]>(
    {
      mutationFn: api.createChatter,
      onSuccess: (data) => {
        queryClient.setQueryData<ChatterEntity[]>(
          chattersKeys.list.queryKey,
          (chatters) =>
            [...(chatters ?? []), data]
        );
      },
    }
  );
};

export const useDeleteChatterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatterEntity, AxiosError, number, ChatterEntity[]>(
    {
      mutationFn: api.deleteChatter,
      onMutate: async (id) => {
        await queryClient.cancelQueries({ ...chattersKeys.list });

        const prev = queryClient.getQueryData<ChatterEntity[]>(
          chattersKeys.list.queryKey
        );

        queryClient.setQueryData<ChatterEntity[]>(
          chattersKeys.list.queryKey,
          (chatter) => (chatter ?? []).filter(chatter => chatter.id !== id)
        );

        return prev;
      },
      onError: (_err, _chatter, context) => {
        queryClient.setQueryData<ChatterEntity[]>(
          chattersKeys.list.queryKey,
          context ?? []
        );
      },
    }
  );
};
