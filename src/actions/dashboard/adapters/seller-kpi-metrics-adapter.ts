import type {
  SellerKpiMetricsResult,
  SellerKpiMetricsResponse,
} from 'src/interfaces/dashboard/seller-kpi-metrics';

export function sellerKpiMetricsAdapter(
  data?: SellerKpiMetricsResponse
): SellerKpiMetricsResult {
  const payload = data?.sellerKpiMetrics;

  if (!payload) {
    return { success: false, message: '', data: null };
  }

  return {
    success: payload.success,
    message: payload.message,
    data: payload.data,
  };
}
