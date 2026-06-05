'use client';

import type {
  SellerPromotionFilterInput,
  SellerPromotionsResponseRaw,
} from 'src/interfaces/promotions';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_SELLER_PROMOTIONS_QUERY } from './graphql';

// ----------------------------------------------------------------------

export const SELLER_PROMOTIONS_KEY = ['sellerPromotions'];

type Variables = {
  pageSize?: number;
  currentPage?: number;
  filter?: SellerPromotionFilterInput;
};

export function useGetSellerPromotions(variables: Variables = {}) {
  const graphql = GraphQLService.getInstance();

  const { pageSize = 20, currentPage = 1, filter } = variables;

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [...SELLER_PROMOTIONS_KEY, pageSize, currentPage, filter],
    queryFn: () =>
      graphql.request<SellerPromotionsResponseRaw, Variables>(GET_SELLER_PROMOTIONS_QUERY, {
        pageSize,
        currentPage,
        filter,
      }),
  });

  const items = data?.sellerPromotions?.items ?? [];
  const totalCount = data?.sellerPromotions?.total_count ?? 0;
  const pageInfo = {
    pageSize: data?.sellerPromotions?.page_size ?? pageSize,
    currentPage: data?.sellerPromotions?.current_page ?? currentPage,
  };

  return { items, totalCount, pageInfo, isLoading, isError, isFetching };
}
