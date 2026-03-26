'use client';

import type {  DashboardData, SellerMetricsDashboard } from 'src/interfaces/dashboard/dashboard';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_DASHBOARD_DATA_QUERY } from './graphql/queries';
import { dashboardDataAdapter } from './adapters/dashboard-data-adapter';

export function useGetDashboardData() {

  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getDashboardData'],
    queryFn: () => graphql.request<DashboardData, {}>(GET_DASHBOARD_DATA_QUERY),
  });

  const returns = useMemo<SellerMetricsDashboard>(() => dashboardDataAdapter(data!), [data]);
  return { returns, isLoading, isError };
}
