import type {
  SellerReputationIndicatorsPayload,
  SellerReputationIndicatorsResponse,
} from 'src/interfaces/dashboard/seller-reputation-indicators';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { sellerReputationIndicatorsAdapter } from './adapters/seller-reputation-indicators-adapter';
import { GET_SELLER_REPUTATION_INDICATORS_QUERY } from './graphql/queries/get-seller-reputation-indicators';

export function useGetSellerReputationIndicators() {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sellerReputationIndicators'],
    queryFn: () =>
      graphql.request<SellerReputationIndicatorsResponse>(GET_SELLER_REPUTATION_INDICATORS_QUERY),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const reputation = useMemo<SellerReputationIndicatorsPayload>(
    () => sellerReputationIndicatorsAdapter(data),
    [data]
  );

  return { reputation, isLoading, isError };
}
