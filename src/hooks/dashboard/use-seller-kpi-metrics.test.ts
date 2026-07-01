import type { SellerKpiMetricsResult } from 'src/interfaces/dashboard/seller-kpi-metrics';
import type { KpiMetricsVariables } from 'src/actions/dashboard/use-get-seller-kpi-metrics';

import { renderHook } from '@testing-library/react';

const mockUseGetSellerKpiMetrics = jest.fn();

jest.mock('src/actions/dashboard/use-get-seller-kpi-metrics', () => ({
  useGetSellerKpiMetrics: (...args: any[]) => mockUseGetSellerKpiMetrics(...args),
}));

import { useSellerKpiMetrics } from './use-seller-kpi-metrics';

const defaultVariables: KpiMetricsVariables = {
  fromDate: '2026-01-01',
  toDate: '2026-01-31',
};

const makeMetrics = (overrides?: Partial<SellerKpiMetricsResult>): SellerKpiMetricsResult => ({
  success: true,
  message: 'ok',
  data: null,
  ...overrides,
});

const setReturn = (
  metrics: SellerKpiMetricsResult,
  extra: { isLoading?: boolean; isError?: boolean } = {}
) => {
  mockUseGetSellerKpiMetrics.mockReturnValue({
    metrics,
    isLoading: extra.isLoading ?? false,
    isError: extra.isError ?? false,
  });
};

describe('useSellerKpiMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns data as null when metrics.data is null', () => {
    setReturn(makeMetrics({ data: null }));
    const { result } = renderHook(() => useSellerKpiMetrics(defaultVariables));
    expect(result.current.data).toBeNull();
  });

  it('returns hasComparison false when metrics.data is null', () => {
    setReturn(makeMetrics({ data: null }));
    const { result } = renderHook(() => useSellerKpiMetrics(defaultVariables));
    expect(result.current.hasComparison).toBe(false);
  });

  it('returns hasComparison false when metrics.data has has_comparison false', () => {
    setReturn(
      makeMetrics({
        data: {
          period_from: '2026-01-01',
          period_to: '2026-01-31',
          compare_from: null,
          compare_to: null,
          has_comparison: false,
          gross_sales: { current: 100, previous: null, variation_pct: null, is_new: false },
          units_sold: { current: 10, previous: null, variation_pct: null, is_new: false },
          average_price: { current: 10, previous: null, variation_pct: null, is_new: false },
          visits: { current: 200, previous: null, variation_pct: null, is_new: false },
          conversion: { current: 5, previous: null, variation_pct: null, is_new: false },
          cancellation_rate: { current: 1, previous: null, variation_pct: null, is_new: false },
        },
      })
    );
    const { result } = renderHook(() => useSellerKpiMetrics(defaultVariables));
    expect(result.current.hasComparison).toBe(false);
  });

  it('returns hasComparison true when metrics.data has has_comparison true', () => {
    setReturn(
      makeMetrics({
        data: {
          period_from: '2026-01-01',
          period_to: '2026-01-31',
          compare_from: '2025-12-01',
          compare_to: '2025-12-31',
          has_comparison: true,
          gross_sales: { current: 100, previous: 80, variation_pct: 25, is_new: false },
          units_sold: { current: 10, previous: 8, variation_pct: 25, is_new: false },
          average_price: { current: 10, previous: 10, variation_pct: 0, is_new: false },
          visits: { current: 200, previous: 160, variation_pct: 25, is_new: false },
          conversion: { current: 5, previous: 5, variation_pct: 0, is_new: false },
          cancellation_rate: { current: 1, previous: 2, variation_pct: -50, is_new: false },
        },
      })
    );
    const { result } = renderHook(() => useSellerKpiMetrics(defaultVariables));
    expect(result.current.hasComparison).toBe(true);
  });

  it('returns data when metrics.data is present', () => {
    const metricsData = {
      period_from: '2026-01-01',
      period_to: '2026-01-31',
      compare_from: null,
      compare_to: null,
      has_comparison: false,
      gross_sales: { current: 500, previous: null, variation_pct: null, is_new: true },
      units_sold: { current: 50, previous: null, variation_pct: null, is_new: true },
      average_price: { current: 10, previous: null, variation_pct: null, is_new: true },
      visits: { current: 1000, previous: null, variation_pct: null, is_new: true },
      conversion: { current: 5, previous: null, variation_pct: null, is_new: true },
      cancellation_rate: { current: 2, previous: null, variation_pct: null, is_new: true },
    };
    setReturn(makeMetrics({ data: metricsData }));
    const { result } = renderHook(() => useSellerKpiMetrics(defaultVariables));
    expect(result.current.data).toEqual(metricsData);
  });

  it('passes isLoading through', () => {
    setReturn(makeMetrics(), { isLoading: true });
    const { result } = renderHook(() => useSellerKpiMetrics(defaultVariables));
    expect(result.current.isLoading).toBe(true);
  });

  it('passes isError through', () => {
    setReturn(makeMetrics(), { isError: true });
    const { result } = renderHook(() => useSellerKpiMetrics(defaultVariables));
    expect(result.current.isError).toBe(true);
  });

  it('forwards variables to the action hook', () => {
    setReturn(makeMetrics());
    renderHook(() => useSellerKpiMetrics(defaultVariables));
    expect(mockUseGetSellerKpiMetrics).toHaveBeenCalledWith(defaultVariables);
  });
});
