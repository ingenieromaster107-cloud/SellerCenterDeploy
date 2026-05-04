'use client';

import type { ReturnListRequestInterface, ReturnListResponseInterface } from 'src/interfaces';

import { useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_RETURNS_QUERY } from './graphql';
import { returnsListAdapter } from './adapters/return-list-adapter';

type UseGetReturnsParams = {
  currentPage: number;
  pageSize: number;
};

export function useGetReturns({ currentPage, pageSize }: UseGetReturnsParams) {

  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['getReturns', currentPage, pageSize],
    queryFn: () =>
      graphql.request<ReturnListResponseInterface, { currentPage: number; pageSize: number }>(
        GET_RETURNS_QUERY,
        { currentPage, pageSize }
      ),
    placeholderData: keepPreviousData,
  });

  const returns = useMemo<ReturnListRequestInterface>(() => returnsListAdapter(data!), [data]);
  return { returns, isLoading, isError, isFetching };
}
