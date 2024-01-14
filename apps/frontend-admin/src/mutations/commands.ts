import { UpdateCommandDto, CommandEntity } from "@shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../api/api";
import { commandsKeys } from "../queries/commands";

export const useUpdateCommandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CommandEntity,
    AxiosError,
    UpdateCommandDto,
    CommandEntity[]
  >({
    mutationFn: api.updateCommand,
    onMutate: async (data) => {
      await queryClient.cancelQueries(commandsKeys.list);

      const prev =
        queryClient.getQueryData<CommandEntity[]>(commandsKeys.list.queryKey);

      queryClient.setQueryData<UpdateCommandDto[]>(
        commandsKeys.list.queryKey,
        (commands) =>
          (commands ?? []).map((command) =>
            command.id === data.id ? { ...command, ...data } : command
          )
      );

      return prev;
    },
    onError: (_err, _commands, context) => {
      queryClient.setQueryData<UpdateCommandDto[]>(
        commandsKeys.list.queryKey,
        context ?? []
      );
    },
  });
};
