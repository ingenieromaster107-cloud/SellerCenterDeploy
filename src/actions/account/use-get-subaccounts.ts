'use client';

import type { SubAccountInterface, SubAccountResponseInterface } from 'src/interfaces';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_SUBACCOUNTS_QUERY } from './graphql';
import { subaccountListAdapter } from './adapters/subaccount-list-adapter';

export function useGetSubAccounts() {

  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getSubAccounts'],
    queryFn: () => graphql.request<{ getSellerSubAccounts: SubAccountResponseInterface[] }, {}>(GET_SUBACCOUNTS_QUERY),
    // staleTime: 1000 * 60 * 5, // Mantiene los datos actualizados por 5 minutos
  });

  const accounts = useMemo<SubAccountInterface[]>(() => subaccountListAdapter(data?.getSellerSubAccounts || []), [data]);
  return { accounts, isLoading, isError };
}
