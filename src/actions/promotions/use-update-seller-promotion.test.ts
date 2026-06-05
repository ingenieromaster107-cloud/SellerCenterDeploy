import React from 'react';
import { act, waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useUpdateSellerPromotion } from './use-update-seller-promotion';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest }),
  },
}));

const mockPromotion = {
  entity_id: 3,
  name: 'Updated Sale',
  discount_type: 'BY_PERCENT',
  apply_type: 'AUTOMATIC',
  discount_amount: 20,
  from_date: '2026-06-01',
  budget_spent: 0,
  uses_per_customer: 1,
  times_used: 2,
  applies_to_all_products: true,
  status: 'ACTIVE',
};

const mockSuccessResponse = {
  updateSellerPromotion: {
    success: true,
    message: 'Promotion updated',
    promotion: mockPromotion,
  },
};

const mockVariables = {
  promotion_id: 3,
  input: { name: 'Updated Sale', discount_amount: 20 },
};

const createWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useUpdateSellerPromotion', () => {
  beforeEach(() => jest.clearAllMocks());

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useUpdateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isIdle).toBe(true);
  });

  it('calls GraphQL request with promotion_id and input', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => useUpdateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(mockVariables); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalledWith(
      expect.anything(),
      { promotion_id: 3, input: { name: 'Updated Sale', discount_amount: 20 } }
    );
  });

  it('returns updated promotion data on success', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => useUpdateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(mockVariables); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.promotion.entity_id).toBe(3);
    expect(result.current.data?.success).toBe(true);
  });

  it('sets isError on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Update failed'));
    const { result } = renderHook(() => useUpdateSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(mockVariables); });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('invalidates sellerPromotions list and detail queries on success', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = jest.spyOn(qc, 'invalidateQueries');
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: qc }, children);

    const { result } = renderHook(() => useUpdateSellerPromotion(), { wrapper });
    act(() => { result.current.mutate(mockVariables); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['sellerPromotions'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['sellerPromotion', 3] });
  });

  it('calls onSuccess callback with the response data', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useUpdateSellerPromotion({ onSuccess }), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(mockVariables); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalledWith(mockSuccessResponse.updateSellerPromotion);
  });

  it('calls onError callback on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const onError = jest.fn();
    const { result } = renderHook(() => useUpdateSellerPromotion({ onError }), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(mockVariables); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onError).toHaveBeenCalled();
  });
});
