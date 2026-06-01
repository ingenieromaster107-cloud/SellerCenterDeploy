import type { SellerReputationIndicatorsResponse } from 'src/interfaces/dashboard/seller-reputation-indicators';

import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetSellerReputationIndicators } from './use-get-seller-reputation-indicators';

const mockRequest = jest.fn();

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest }),
  },
}));

jest.mock('./graphql/queries/get-seller-reputation-indicators', () => ({
  GET_SELLER_REPUTATION_INDICATORS_QUERY: 'GET_SELLER_REPUTATION_INDICATORS_QUERY',
}));

const validResponse: SellerReputationIndicatorsResponse = {
  sellerReputationIndicators: {
    success: true,
    message: 'ok',
    data: {
      reputation_level: 'GREEN',
      insufficient_data: false,
      completed_sales: 50,
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
  },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useGetSellerReputationIndicators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.mockResolvedValue(validResponse);
  });

  it('returns adapted reputation after a successful fetch', async () => {
    const { result } = renderHook(() => useGetSellerReputationIndicators(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(false);
    expect(result.current.reputation.success).toBe(true);
    expect(result.current.reputation.message).toBe('ok');
    expect(result.current.reputation.data?.reputation_level).toBe('GREEN');
  });

  it('calls graphql.request with the reputation query', async () => {
    const { result } = renderHook(() => useGetSellerReputationIndicators(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockRequest).toHaveBeenCalledWith('GET_SELLER_REPUTATION_INDICATORS_QUERY');
  });

  it('returns empty state and isError on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useGetSellerReputationIndicators(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.reputation.success).toBe(false);
    expect(result.current.reputation.data?.reputation_level).toBe('INSUFFICIENT_DATA');
    expect(result.current.reputation.data?.insufficient_data).toBe(true);
  });
});
