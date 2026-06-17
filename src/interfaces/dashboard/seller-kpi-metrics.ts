export interface SellerKpiMetric {
  current: number;
  previous: number | null;
  variation_pct: number | null;
  is_new: boolean;
}

export type SellerKpiMetricKey =
  | 'gross_sales'
  | 'units_sold'
  | 'average_price'
  | 'visits'
  | 'conversion'
  | 'cancellation_rate';

export type SellerKpiMetricsData = {
  period_from: string;
  period_to: string;
  compare_from: string | null;
  compare_to: string | null;
  has_comparison: boolean;
} & Record<SellerKpiMetricKey, SellerKpiMetric>;

export interface SellerKpiMetricsResult {
  success: boolean;
  message: string;
  data: SellerKpiMetricsData | null;
}

export interface SellerKpiMetricsResponse {
  sellerKpiMetrics: SellerKpiMetricsResult;
}
