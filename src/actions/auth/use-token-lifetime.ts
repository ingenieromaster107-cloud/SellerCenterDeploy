'use client';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_TOKEN_LIFETIME_QUERY } from './graphql/query/store-config';

interface StoreConfigResponse {
  storeConfig: {
    customer_access_token_lifetime: number | null;
  };
}

export const TOKEN_LIFETIME_KEY = ['store-config', 'token-lifetime'] as const;

export function useTokenLifetime() {
  const graphql = GraphQLService.getInstance();

  return useQuery({
    queryKey: TOKEN_LIFETIME_KEY,
    queryFn: () =>
      graphql
        .request<StoreConfigResponse, {}>(GET_TOKEN_LIFETIME_QUERY, {})
        .then((data) => data?.storeConfig?.customer_access_token_lifetime ?? null),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}
