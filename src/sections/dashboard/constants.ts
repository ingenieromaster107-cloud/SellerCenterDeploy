import type { SellerKpiMetricKey } from 'src/interfaces/dashboard/seller-kpi-metrics';

export type KpiMetricFormat = 'currency' | 'number' | 'percent';

type KpiMetricConfig = {
  key: SellerKpiMetricKey;
  titleKey: string;
  format: KpiMetricFormat;
  additive: boolean;
};

export const KPI_METRICS: KpiMetricConfig[] = [
  { key: 'gross_sales', titleKey: 'dashboardModule.kpiMetrics.metrics.grossSales', format: 'currency', additive: true },
  { key: 'units_sold', titleKey: 'dashboardModule.kpiMetrics.metrics.unitsSold', format: 'number', additive: true },
  { key: 'average_price', titleKey: 'dashboardModule.kpiMetrics.metrics.averagePrice', format: 'currency', additive: false },
  { key: 'visits', titleKey: 'dashboardModule.kpiMetrics.metrics.visits', format: 'number', additive: true },
  { key: 'conversion', titleKey: 'dashboardModule.kpiMetrics.metrics.conversion', format: 'percent', additive: false },
  { key: 'cancellation_rate', titleKey: 'dashboardModule.kpiMetrics.metrics.cancellationRate', format: 'percent', additive: false },
];
