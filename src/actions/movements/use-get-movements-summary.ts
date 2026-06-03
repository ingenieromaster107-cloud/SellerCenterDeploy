import type { MovementsSummary } from 'src/sections/movements/types';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { SELLER_MOVEMENTS_SUMMARY_QUERY } from './graphql/queries';

type GqlSummaryResponse = {
  sellerMovementsSummary: MovementsSummary;
};

export function useGetMovementsSummary(dateFrom: string, dateTo: string) {
  const graphql = GraphQLService.getInstance();
  const queryKey = ['movements:summary', dateFrom, dateTo] as const;

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey,
    queryFn: async (): Promise<MovementsSummary> => {
      const response = await graphql.request<
        GqlSummaryResponse,
        { date_from: string; date_to: string }
      >(SELLER_MOVEMENTS_SUMMARY_QUERY, {
        date_from: dateFrom,
        date_to: dateTo,
      });
      return response.sellerMovementsSummary;
    },
    enabled: Boolean(dateFrom && dateTo),
    staleTime: 30_000,
  });

  return { summary: data, isLoading, isFetching, isError };
}
