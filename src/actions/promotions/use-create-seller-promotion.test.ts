import React from 'react';
import { act, waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useCreateSellerPromotion } from './use-create-seller-promotion';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest }),
  },
}));

const mockInput = {
  name: 'Summer Sale',
  discount_type: 'BY_PERCENT' as const,
  apply_type: 'AUTOMATIC' as const,
  discount_amount: 15,
  from_date: '2026-06-01',
  applies_to_all_products: true,
};

const mockPromotion = {
  entity_id: 1,
  name: 'Summer Sale',
  discount_type: 'BY_PERCENT',
  apply_type: 'AUTOMATIC',
  discount_amount: 15,
  from_date: '2026-06-01',
  budget_spent: 0,
  uses_per_customer: 1,
  times_used: 0,
  applies_to_all_products: true,
  status: 'PENDING_APPROVAL',
};

const mockSuccessResponse = {
  createSellerPromotion: {
    success: true,
    message: 'Promotion created',
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

describe('useCreateSellerPromotion', () => {
  beforeEach(() => jest.clearAllMocks());

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useCreateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
  });

  it('calls GraphQL request with the correct variables', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => useCreateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(mockInput); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalledWith(
      expect.anything(),
      { input: mockInput }
    );
  });

  it('returns the promotion data on success', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => useCreateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(mockInput); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.promotion.name).toBe('Summer Sale');
    expect(result.current.data?.success).toBe(true);
  });

  it('sets isError on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Server error'));
    const { result } = renderHook(() => useCreateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(mockInput); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Server error');
  });

  it('invalidates sellerPromotions query on success', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = jest.spyOn(qc, 'invalidateQueries');
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: qc }, children);

    const { result } = renderHook(() => useCreateSellerPromotion(), { wrapper });
    act(() => { result.current.mutate(mockInput); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['sellerPromotions'] });
  });

  it('calls onSuccess callback with the response data', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useCreateSellerPromotion({ onSuccess }), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(mockInput); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalledWith(mockSuccessResponse.createSellerPromotion);
  });

  it('calls onError callback on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const onError = jest.fn();
    const { result } = renderHook(() => useCreateSellerPromotion({ onError }), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(mockInput); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onError).toHaveBeenCalled();
  });
});
