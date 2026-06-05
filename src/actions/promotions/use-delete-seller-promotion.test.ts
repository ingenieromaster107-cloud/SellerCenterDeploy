import React from 'react';
import { act, waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useDeleteSellerPromotion } from './use-delete-seller-promotion';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest }),
  },
}));

const mockSuccessResponse = {
  deleteSellerPromotion: {
    success: true,
    message: 'Promotion deleted',
  },
};

const createWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useDeleteSellerPromotion', () => {
  beforeEach(() => jest.clearAllMocks());

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useDeleteSellerPromotion(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isIdle).toBe(true);
  });

  it('calls GraphQL request with the promotion_id', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => useDeleteSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(7); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalledWith(
      expect.anything(),
      { promotion_id: 7 }
    );
  });

  it('returns success data after deletion', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const { result } = renderHook(() => useDeleteSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(7); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.success).toBe(true);
  });

  it('sets isError on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Cannot delete'));
    const { result } = renderHook(() => useDeleteSellerPromotion(), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(7); });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('invalidates sellerPromotions list on success', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = jest.spyOn(qc, 'invalidateQueries');
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: qc }, children);

    const { result } = renderHook(() => useDeleteSellerPromotion(), { wrapper });
    act(() => { result.current.mutate(7); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['sellerPromotions'] });
  });

  it('calls onSuccess callback', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useDeleteSellerPromotion({ onSuccess }), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(7); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalledWith(mockSuccessResponse.deleteSellerPromotion);
  });

  it('calls onError callback on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const onError = jest.fn();
    const { result } = renderHook(() => useDeleteSellerPromotion({ onError }), {
      wrapper: createWrapper(),
    });
    act(() => { result.current.mutate(7); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onError).toHaveBeenCalled();
  });
});
