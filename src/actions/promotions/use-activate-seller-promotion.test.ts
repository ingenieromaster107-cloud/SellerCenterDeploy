import React from 'react';
import { act, waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useActivateSellerPromotion } from './use-activate-seller-promotion';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest }),
  },
}));

const mockPromotion = {
  entity_id: 6,
  name: 'Weekend Promo',
  discount_type: 'BY_FIXED',
  apply_type: 'AUTOMATIC',
  discount_amount: 5,
  from_date: '2026-06-01',
  budget_spent: 0,
  uses_per_customer: 2,
  times_used: 0,
  applies_to_all_products: true,
  status: 'ACTIVE',
};

const mockSuccessResponse = {
  activateSellerPromotion: {
    success: true,
    message: 'Promotion activated',
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

describe('useActivateSellerPromotion', () => {
  beforeEach(() => jest.clearAllMocks());

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useActivateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isIdle).toBe(true);
  });

  it('calls GraphQL request with the promotion_id', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => useActivateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(6); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalledWith(expect.anything(), { promotion_id: 6 });
  });

  it('returns success data on success', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => useActivateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(6); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.promotion.status).toBe('ACTIVE');
  });

  it('sets isError on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Activate failed'));
    const { result } = renderHook(() => useActivateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(6); });
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

    const { result } = renderHook(() => useActivateSellerPromotion(), { wrapper });
    act(() => { result.current.mutate(6); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['sellerPromotions'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['sellerPromotion', 6] });
  });

  it('calls onSuccess callback', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useActivateSellerPromotion({ onSuccess }), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(6); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalledWith(mockSuccessResponse.activateSellerPromotion);
  });

  it('calls onError callback on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const onError = jest.fn();
    const { result } = renderHook(() => useActivateSellerPromotion({ onError }), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(6); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onError).toHaveBeenCalled();
  });
});
