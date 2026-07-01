import type {
  SellerKpiMetricsData,
  SellerKpiMetricsResponse,
} from 'src/interfaces/dashboard/seller-kpi-metrics';

import { sellerKpiMetricsAdapter } from './seller-kpi-metrics-adapter';

const METRIC = { current: 100, previous: null, variation_pct: null, is_new: false };

const VALID_DATA: SellerKpiMetricsData = {
  period_from: '2026-01-01',
  period_to: '2026-01-31',
  compare_from: null,
  compare_to: null,
  has_comparison: false,
  gross_sales: METRIC,
  units_sold: { current: 5, previous: null, variation_pct: null, is_new: false },
  average_price: { current: 20, previous: null, variation_pct: null, is_new: false },
  visits: { current: 50, previous: null, variation_pct: null, is_new: false },
  conversion: { current: 10, previous: null, variation_pct: null, is_new: false },
  cancellation_rate: { current: 2, previous: null, variation_pct: null, is_new: false },
};

const VALID_RESPONSE: SellerKpiMetricsResponse = {
  sellerKpiMetrics: { success: true, message: 'ok', data: VALID_DATA },
};

describe('sellerKpiMetricsAdapter', () => {
  describe('when input is falsy or sellerKpiMetrics is absent', () => {
    it('returns empty default when called with no argument', () => {
      const result = sellerKpiMetricsAdapter();
      expect(result).toEqual({ success: false, message: '', data: null });
    });

    it('returns empty default when called with null', () => {
      const result = sellerKpiMetricsAdapter(null as unknown as SellerKpiMetricsResponse);
      expect(result).toEqual({ success: false, message: '', data: null });
    });

    it('returns empty default when sellerKpiMetrics key is absent', () => {
      const result = sellerKpiMetricsAdapter({} as SellerKpiMetricsResponse);
      expect(result).toEqual({ success: false, message: '', data: null });
    });

    it('returns empty default when sellerKpiMetrics is null', () => {
      const result = sellerKpiMetricsAdapter({ sellerKpiMetrics: null as any });
      expect(result).toEqual({ success: false, message: '', data: null });
    });
  });

  describe('when input contains a valid payload', () => {
    it('returns success true', () => {
      expect(sellerKpiMetricsAdapter(VALID_RESPONSE).success).toBe(true);
    });

    it('returns the message from the payload', () => {
      expect(sellerKpiMetricsAdapter(VALID_RESPONSE).message).toBe('ok');
    });

    it('returns the data object from the payload', () => {
      expect(sellerKpiMetricsAdapter(VALID_RESPONSE).data).toBe(VALID_DATA);
    });

    it('propagates success false when the API reports an error', () => {
      const response: SellerKpiMetricsResponse = {
        sellerKpiMetrics: { success: false, message: 'server error', data: null },
      };
      const result = sellerKpiMetricsAdapter(response);
      expect(result.success).toBe(false);
      expect(result.message).toBe('server error');
      expect(result.data).toBeNull();
    });

    it('returns the full payload when data is null inside a valid wrapper', () => {
      const response: SellerKpiMetricsResponse = {
        sellerKpiMetrics: { success: true, message: 'empty', data: null },
      };
      const result = sellerKpiMetricsAdapter(response);
      expect(result).toEqual({ success: true, message: 'empty', data: null });
    });
  });
});
