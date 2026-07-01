import type { DataList } from 'src/interfaces/order';
import type { PageListInfo, PageInfoResponse } from 'src/interfaces/graphql/graphql-shared.interfaces';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_ORDERS } from './queries/get-order-data';

export function useGetOrders(productsPerPage: PageListInfo) {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['graphql:getOrders', productsPerPage],
    queryFn: async () => graphql.request<DataList, PageListInfo>(GET_ORDERS, productsPerPage),
  });

  const totalCount: number = data?.sellerOrders?.total_count || 0;
  const pageInfo: PageInfoResponse | undefined = data?.sellerOrders?.page_info;

  return { data, isLoading, isError, pageInfo, totalCount };
}
