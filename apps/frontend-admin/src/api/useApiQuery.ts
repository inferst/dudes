import { DefaultError, QueryKey } from '@tanstack/query-core';
import { QueryClient, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    if (query.error) {
      const errorCodes = [401, 403];

      if (isAxiosError(query.error) && query.error.response?.status) {
        if (errorCodes.includes(query.error.response.status)) {
          navigate('/admin/login');
        }
      }
    }
  }, [query.error, navigate]);

  return query;
};
