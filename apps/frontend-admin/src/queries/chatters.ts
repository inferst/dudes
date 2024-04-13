import { createQueryKeys } from "@lukemorales/query-key-factory";
import { api } from "../api/api";
import { useApiQuery } from "../api/useApiQuery";

export const chattersKeys = createQueryKeys('chatters', {
  list: {
    queryKey: null,
    queryFn: api.getChatters,
  },
});

export const useChattersQuery = () =>
  useApiQuery({
    ...chattersKeys.list,
  });
