import { DefaultError, QueryKey } from '@tanstack/query-core';
import { QueryClient, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect, useMemo } from 'react';
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
  const query = useQuery({ ...options }, queryClient);

  const redirect = useMemo(() => {
    if (isAxiosError(query.error)) {
      if (query.error.response) {
        const type = query.error.response.data.type as string;

        if (!type && errorCodes.includes(query.error.response.status)) {
          return true;
        }
      }
    }

    return false;
  }, [query.error]);

  // TODO: move redirect to global query client
  useEffect(() => {
    if (redirect) {
      navigate('/admin/login');
    }
  }, [redirect, navigate]);

  return query;
};
