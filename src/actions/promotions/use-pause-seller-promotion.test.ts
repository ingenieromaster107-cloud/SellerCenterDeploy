import React from 'react';
import { act, waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { usePauseSellerPromotion } from './use-pause-seller-promotion';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest }),
  },
}));

const mockPromotion = {
  entity_id: 4,
  name: 'Flash Deal',
  discount_type: 'BY_PERCENT',
  apply_type: 'AUTOMATIC',
  discount_amount: 10,
  from_date: '2026-06-01',
  budget_spent: 0,
  uses_per_customer: 1,
  times_used: 0,
  applies_to_all_products: true,
  status: 'PAUSED',
};

const mockSuccessResponse = {
  pauseSellerPromotion: {
    success: true,
    message: 'Promotion paused',
    promotion: mockPromotion,
  },
};

const createWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('usePauseSellerPromotion', () => {
  beforeEach(() => jest.clearAllMocks());

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => usePauseSellerPromotion(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isIdle).toBe(true);
  });

  it('calls GraphQL request with the promotion_id', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => usePauseSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(4); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalledWith(expect.anything(), { promotion_id: 4 });
  });

  it('returns success data on success', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => usePauseSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(4); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.promotion.status).toBe('PAUSED');
  });

  it('sets isError on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Pause failed'));
    const { result } = renderHook(() => usePauseSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(4); });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('invalidates sellerPromotions list and detail on success', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = jest.spyOn(qc, 'invalidateQueries');
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: qc }, children);

    const { result } = renderHook(() => usePauseSellerPromotion(), { wrapper });
    act(() => { result.current.mutate(4); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['sellerPromotions'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['sellerPromotion', 4] });
  });

  it('calls onSuccess callback', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const onSuccess = jest.fn();
    const { result } = renderHook(() => usePauseSellerPromotion({ onSuccess }), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(4); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalledWith(mockSuccessResponse.pauseSellerPromotion);
  });

  it('calls onError callback on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const onError = jest.fn();
    const { result } = renderHook(() => usePauseSellerPromotion({ onError }), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(4); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onError).toHaveBeenCalled();
  });
});
