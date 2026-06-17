import { sellerKpiMetricsAdapter } from './seller-kpi-metrics-adapter';

describe('sellerKpiMetricsAdapter', () => {
  it('returns null data when source data is undefined', () => {
    const result = sellerKpiMetricsAdapter();

    expect(result).toEqual({ success: false, message: '', data: null });
  });

  it('returns provided metrics payload when data is present', () => {
    const source = {
      sellerKpiMetrics: {
        success: true,
        message: 'ok',
        data: {
          period_from: '2026-01-01',
          period_to: '2026-01-31',
          compare_from: null,
          compare_to: null,
          has_comparison: false,
          gross_sales: { current: 100, previous: null, variation_pct: null, is_new: false },
          units_sold: { current: 5, previous: null, variation_pct: null, is_new: false },
          average_price: { current: 20, previous: null, variation_pct: null, is_new: false },
          visits: { current: 50, previous: null, variation_pct: null, is_new: false },
          conversion: { current: 10, previous: null, variation_pct: null, is_new: false },
          cancellation_rate: { current: 2, previous: null, variation_pct: null, is_new: false },
        },
      },
    };

    const result = sellerKpiMetricsAdapter(source as any);

    expect(result).toEqual(source.sellerKpiMetrics);
  });
});
