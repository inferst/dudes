import {
  QueryClient,
  UseQueryOptions,
  useQuery,
  DefaultError,
  QueryKey,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const errorCodes = [401, 403];

export const useApiQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient
) => {
  const navigate = useNavigate();
  const query = useQuery(options, queryClient);

  useEffect(() => {
    if (isAxiosError(query.error)) {
      if (query.error.response) {
        const type = query.error.response.data.type as string;

        if (!type && errorCodes.includes(query.error.response.status)) {
          navigate('/admin/login');
        }
      }
    }
  }, [query.error, navigate]);

  return query;
};
