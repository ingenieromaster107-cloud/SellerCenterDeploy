import type {
  SellerReputationIndicatorsData,
  SellerReputationIndicatorsResponse,
} from 'src/interfaces/dashboard/seller-reputation-indicators';

import { sellerReputationIndicatorsAdapter } from './seller-reputation-indicators-adapter';

const makeData = (
  partial: Partial<SellerReputationIndicatorsData> = {}
): SellerReputationIndicatorsData => ({
  reputation_level: 'GREEN',
  insufficient_data: false,
  completed_sales: 120,
  cancellation_rate: 2,
  cancellation_level: 'GREEN',
  cancellation_suggestion: null,
  claims_rate: 1,
  claims_level: 'GREEN',
  claims_suggestion: null,
  on_time_dispatch_rate: 98,
  on_time_dispatch_level: 'GREEN',
  on_time_dispatch_suggestion: null,
  avg_response_time: 4,
  avg_response_time_level: 'GREEN',
  avg_response_time_suggestion: null,
  period_from: '2024-05-01',
  period_to: '2024-05-31',
  calculated_at: '2024-06-01T10:00:00',
  ...partial,
});

const EMPTY_REPUTATION = {
  reputation_level: 'INSUFFICIENT_DATA',
  insufficient_data: true,
  completed_sales: 0,
  cancellation_rate: null,
  claims_rate: null,
  on_time_dispatch_rate: null,
  avg_response_time: null,
  period_from: '',
  period_to: '',
  calculated_at: '',
};

describe('sellerReputationIndicatorsAdapter', () => {
  describe('when input is falsy or sellerReputationIndicators is absent', () => {
    it('returns empty default when called with no argument', () => {
      const result = sellerReputationIndicatorsAdapter();
      expect(result.success).toBe(false);
      expect(result.message).toBe('');
      expect(result.data).toMatchObject(EMPTY_REPUTATION);
    });

    it('returns empty default when called with null', () => {
       
      const result = sellerReputationIndicatorsAdapter(null as any);
      expect(result.success).toBe(false);
      expect(result.data).toMatchObject(EMPTY_REPUTATION);
    });

    it('returns empty default when sellerReputationIndicators key is absent', () => {
      const result = sellerReputationIndicatorsAdapter({} as SellerReputationIndicatorsResponse);
      expect(result.success).toBe(false);
      expect(result.message).toBe('');
      expect(result.data?.reputation_level).toBe('INSUFFICIENT_DATA');
      expect(result.data?.insufficient_data).toBe(true);
    });
  });

  describe('when input contains a valid payload', () => {
    it('returns success true', () => {
      const data = makeData();
      const response: SellerReputationIndicatorsResponse = {
        sellerReputationIndicators: { success: true, message: 'ok', data },
      };
      expect(sellerReputationIndicatorsAdapter(response).success).toBe(true);
    });

    it('returns the message from the payload', () => {
      const response: SellerReputationIndicatorsResponse = {
        sellerReputationIndicators: { success: true, message: 'ok', data: makeData() },
      };
      expect(sellerReputationIndicatorsAdapter(response).message).toBe('ok');
    });

    it('returns the data object by reference', () => {
      const data = makeData();
      const response: SellerReputationIndicatorsResponse = {
        sellerReputationIndicators: { success: true, message: 'ok', data },
      };
      expect(sellerReputationIndicatorsAdapter(response).data).toBe(data);
    });

    it('returns the correct reputation_level from data', () => {
      const response: SellerReputationIndicatorsResponse = {
        sellerReputationIndicators: { success: true, message: 'ok', data: makeData({ reputation_level: 'RED' }) },
      };
      expect(sellerReputationIndicatorsAdapter(response).data?.reputation_level).toBe('RED');
    });
  });

  describe('when payload exists but data is null', () => {
    it('falls back to EMPTY_REPUTATION_DATA while preserving success and message', () => {
      const response: SellerReputationIndicatorsResponse = {
        sellerReputationIndicators: { success: true, message: 'no-data', data: null },
      };
      const result = sellerReputationIndicatorsAdapter(response);
      expect(result.success).toBe(true);
      expect(result.message).toBe('no-data');
      expect(result.data).toMatchObject(EMPTY_REPUTATION);
    });
  });
});
