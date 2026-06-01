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
  calculated_at: '2024-06-01 10:00:00',
  ...partial,
});

describe('sellerReputationIndicatorsAdapter', () => {
  it('returns empty state when data is undefined', () => {
    const result = sellerReputationIndicatorsAdapter(undefined);

    expect(result.success).toBe(false);
    expect(result.message).toBe('');
    expect(result.data).toMatchObject({
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
    });
  });

  it('returns empty state when sellerReputationIndicators is missing', () => {
    const result = sellerReputationIndicatorsAdapter({} as SellerReputationIndicatorsResponse);

    expect(result.success).toBe(false);
    expect(result.message).toBe('');
    expect(result.data?.reputation_level).toBe('INSUFFICIENT_DATA');
    expect(result.data?.insufficient_data).toBe(true);
  });

  it('passes through a valid populated response', () => {
    const data = makeData();
    const response: SellerReputationIndicatorsResponse = {
      sellerReputationIndicators: {
        success: true,
        message: 'ok',
        data,
      },
    };

    const result = sellerReputationIndicatorsAdapter(response);

    expect(result.success).toBe(true);
    expect(result.message).toBe('ok');
    expect(result.data).toBe(data);
  });

  it('falls back to empty data but keeps success/message when data is null', () => {
    const response: SellerReputationIndicatorsResponse = {
      sellerReputationIndicators: {
        success: true,
        message: 'no-data',
        data: null,
      },
    };

    const result = sellerReputationIndicatorsAdapter(response);

    expect(result.success).toBe(true);
    expect(result.message).toBe('no-data');
    expect(result.data).toMatchObject({
      reputation_level: 'INSUFFICIENT_DATA',
      insufficient_data: true,
      completed_sales: 0,
    });
  });
});
