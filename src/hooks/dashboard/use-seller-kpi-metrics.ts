import type { KpiMetricsVariables } from 'src/actions/dashboard/use-get-seller-kpi-metrics';

import { useGetSellerKpiMetrics } from 'src/actions/dashboard/use-get-seller-kpi-metrics';

export function useSellerKpiMetrics(variables: KpiMetricsVariables) {
  const { metrics, isLoading, isError } = useGetSellerKpiMetrics(variables);

  return {
    data: metrics.data,
    hasComparison: metrics.data?.has_comparison ?? false,
    isLoading,
    isError,
  };
}
