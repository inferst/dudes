import { createQueryKeys } from "@lukemorales/query-key-factory";
import { api } from "../api/api";
import { useApiQuery } from "../api/use-api-query";

export const commandsKeys = createQueryKeys('commands', {
  list: {
    queryKey: null,
    queryFn: api.getCommands,
  },
});

export const useCommandsQuery = () =>
  useApiQuery({
    ...commandsKeys.list,
  });
