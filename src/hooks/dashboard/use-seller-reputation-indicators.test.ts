import type { SellerReputationIndicatorsPayload } from 'src/interfaces/dashboard/seller-reputation-indicators';

import { renderHook } from '@testing-library/react';

import { useSellerReputationIndicators } from './use-seller-reputation-indicators';

const mockUseGet = jest.fn();

jest.mock('src/actions/dashboard/use-get-seller-reputation-indicators', () => ({
  useGetSellerReputationIndicators: () => mockUseGet(),
}));

const livePayload: SellerReputationIndicatorsPayload = {
  success: true,
  message: 'ok',
  data: {
    reputation_level: 'GREEN',
    insufficient_data: false,
    completed_sales: 100,
    cancellation_rate: 1,
    cancellation_level: 'GREEN',
    cancellation_suggestion: null,
    claims_rate: 0,
    claims_level: 'GREEN',
    claims_suggestion: null,
    on_time_dispatch_rate: 99,
    on_time_dispatch_level: 'GREEN',
    on_time_dispatch_suggestion: null,
    avg_response_time: 2,
    avg_response_time_level: 'GREEN',
    avg_response_time_suggestion: null,
    period_from: '2024-05-01',
    period_to: '2024-05-31',
    calculated_at: '2024-06-01 10:00:00',
  },
};

const setReputation = (
  reputation: SellerReputationIndicatorsPayload,
  extra: { isLoading?: boolean; isError?: boolean } = {}
) => {
  mockUseGet.mockReturnValue({
    reputation,
    isLoading: extra.isLoading ?? false,
    isError: extra.isError ?? false,
  });
};

describe('useSellerReputationIndicators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hasLiveData is true when success, data present and sufficient', () => {
    setReputation(livePayload);
    const { result } = renderHook(() => useSellerReputationIndicators());
    expect(result.current.hasLiveData).toBe(true);
  });

  it('hasLiveData is false when success is false', () => {
    setReputation({ ...livePayload, success: false });
    const { result } = renderHook(() => useSellerReputationIndicators());
    expect(result.current.hasLiveData).toBe(false);
  });

  it('hasLiveData is false when data is null', () => {
    setReputation({ ...livePayload, data: null });
    const { result } = renderHook(() => useSellerReputationIndicators());
    expect(result.current.hasLiveData).toBe(false);
  });

  it('hasLiveData is false when insufficient_data is true', () => {
    setReputation({
      ...livePayload,
      data: { ...livePayload.data!, insufficient_data: true },
    });
    const { result } = renderHook(() => useSellerReputationIndicators());
    expect(result.current.hasLiveData).toBe(false);
  });

  it('passes through isLoading and isError', () => {
    setReputation(livePayload, { isLoading: true, isError: true });
    const { result } = renderHook(() => useSellerReputationIndicators());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(true);
    expect(result.current.reputation).toBe(livePayload);
  });
});
