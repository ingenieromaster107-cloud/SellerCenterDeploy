import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetSellerPromotionDetail } from './use-get-seller-promotion-detail';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest, setHeader: jest.fn() }),
  },
}));

const mockPromotion = {
  entity_id: 5,
  name: 'Flash Deal',
  discount_type: 'BY_FIXED',
  apply_type: 'COUPON',
  discount_amount: 10,
  coupon_code: 'FLASH10',
  from_date: '2026-06-01',
  budget_spent: 50,
  uses_per_customer: 1,
  times_used: 5,
  applies_to_all_products: true,
  status: 'ACTIVE',
};

const mockStats = {
  times_used: 5,
  total_discount_granted: 50,
  total_revenue_generated: 200,
};

const mockResponse = {
  sellerPromotion: {
    promotion: mockPromotion,
    stats: mockStats,
  },
};

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useGetSellerPromotionDetail', () => {
  beforeEach(() => mockRequest.mockReset());

  it('does not fetch when promotionId is null', () => {
    const { result } = renderHook(() => useGetSellerPromotionDetail(null), {
      wrapper: createWrapper(),
    });
    expect(mockRequest).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.promotion).toBeNull();
  });

  it('does not fetch when promotionId is 0', () => {
    const { result } = renderHook(() => useGetSellerPromotionDetail(0), {
      wrapper: createWrapper(),
    });
    expect(mockRequest).not.toHaveBeenCalled();
    expect(result.current.promotion).toBeNull();
  });

  it('returns isLoading true initially when promotionId is valid', () => {
    mockRequest.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGetSellerPromotionDetail(5), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns promotion and stats after successful fetch', async () => {
    mockRequest.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGetSellerPromotionDetail(5), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.promotion?.entity_id).toBe(5);
    expect(result.current.promotion?.name).toBe('Flash Deal');
    expect(result.current.stats?.times_used).toBe(5);
    expect(result.current.stats?.total_discount_granted).toBe(50);
    expect(result.current.isError).toBe(false);
  });

  it('passes promotion_id to the query', async () => {
    mockRequest.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGetSellerPromotionDetail(5), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockRequest).toHaveBeenCalledWith(
      expect.anything(),
      { promotion_id: 5 }
    );
  });

  it('returns isError true on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Not found'));
    const { result } = renderHook(() => useGetSellerPromotionDetail(5), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.promotion).toBeNull();
    expect(result.current.stats).toBeNull();
  });
});
