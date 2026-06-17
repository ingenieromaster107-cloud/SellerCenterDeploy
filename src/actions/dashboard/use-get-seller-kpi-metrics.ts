'use client';

import type {
  SellerKpiMetricsResult,
  SellerKpiMetricsResponse,
} from 'src/interfaces/dashboard/seller-kpi-metrics';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { sellerKpiMetricsAdapter } from './adapters/seller-kpi-metrics-adapter';
import { GET_SELLER_KPI_METRICS_QUERY } from './graphql/queries/get-seller-kpi-metrics';

export type KpiMetricsVariables = {
  fromDate: string;
  toDate: string;
  compareFromDate?: string | null;
  compareToDate?: string | null;
};

export function useGetSellerKpiMetrics(variables: KpiMetricsVariables) {
  const graphql = GraphQLService.getInstance();

  const { compareFromDate = null, compareToDate = null } = variables;

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'sellerKpiMetrics',
      variables.fromDate,
      variables.toDate,
      compareFromDate,
      compareToDate,
    ],
    queryFn: () =>
      graphql.request<SellerKpiMetricsResponse, KpiMetricsVariables>(GET_SELLER_KPI_METRICS_QUERY, {
        ...variables,
        compareFromDate,
        compareToDate,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const metrics = useMemo<SellerKpiMetricsResult>(() => sellerKpiMetricsAdapter(data), [data]);

  return { metrics, isLoading, isError };
}
