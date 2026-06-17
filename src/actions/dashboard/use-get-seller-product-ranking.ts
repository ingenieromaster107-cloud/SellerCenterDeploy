'use client';

import type {
  SellerProductRankingResult,
  SellerProductRankingResponse,
} from 'src/interfaces/dashboard/seller-product-ranking';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { sellerProductRankingAdapter } from './adapters/seller-product-ranking-adapter';
import { GET_SELLER_PRODUCT_RANKING_QUERY } from './graphql/queries/get-seller-product-ranking';

export type ProductRankingDateRange = {
  fromDate: string;
  toDate: string;
};

export function useGetSellerProductRanking(dateRange: ProductRankingDateRange) {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sellerProductRanking', dateRange.fromDate, dateRange.toDate],
    queryFn: () =>
      graphql.request<SellerProductRankingResponse, ProductRankingDateRange>(
        GET_SELLER_PRODUCT_RANKING_QUERY,
        dateRange
      ),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const ranking = useMemo<SellerProductRankingResult>(
    () => sellerProductRankingAdapter(data),
    [data]
  );

  return { ranking, isLoading, isError };
}
