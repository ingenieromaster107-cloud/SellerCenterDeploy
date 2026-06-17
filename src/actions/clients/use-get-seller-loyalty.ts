'use client';

import type { SellerLoyaltyResult, SellerLoyaltyResponse } from 'src/interfaces/clients/seller-loyalty';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { sellerLoyaltyAdapter } from './adapters/seller-loyalty-adapter';
import { GET_SELLER_LOYALTY_QUERY } from './graphql/queries/get-seller-loyalty';

export type LoyaltyDateRange = {
  fromDate: string;
  toDate: string;
};

export function useGetSellerLoyalty(dateRange: LoyaltyDateRange) {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sellerLoyalty', dateRange.fromDate, dateRange.toDate],
    queryFn: () =>
      graphql.request<SellerLoyaltyResponse, LoyaltyDateRange>(GET_SELLER_LOYALTY_QUERY, dateRange),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const loyalty = useMemo<SellerLoyaltyResult>(() => sellerLoyaltyAdapter(data), [data]);

  return { loyalty, isLoading, isError };
}
