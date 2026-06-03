import type {
  Movement,
  MovementsFilters,
  MovementsPagination,
  MovementsListResponse,
} from 'src/sections/movements/types';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { SELLER_MOVEMENTS_QUERY } from './graphql/queries';

type GqlListResponse = {
  sellerMovements: {
    items: Movement[];
    total_count: number;
    page_info: { page_size: number; current_page: number; total_pages: number };
  };
};

export function useGetMovementsList(filters: MovementsFilters, pagination: MovementsPagination) {
  const graphql = GraphQLService.getInstance();
  const queryKey = ['movements:list', filters, pagination] as const;

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: async (): Promise<MovementsListResponse> => {
      const response = await graphql.request<
        GqlListResponse,
        {
          date_from: string;
          date_to: string;
          pageSize: number;
          currentPage: number;
          categories?: string[];
        }
      >(SELLER_MOVEMENTS_QUERY, {
        date_from: filters.dateFrom,
        date_to: filters.dateTo,
        pageSize: pagination.pageSize,
        currentPage: pagination.page + 1,
        ...(filters.categories.length > 0 ? { categories: filters.categories } : {}),
      });
      const { items, total_count } = response.sellerMovements;
      return { items: items ?? [], total_count: total_count ?? 0, search_criteria: null };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  return {
    items: data?.items ?? [],
    totalCount: data?.total_count ?? 0,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
