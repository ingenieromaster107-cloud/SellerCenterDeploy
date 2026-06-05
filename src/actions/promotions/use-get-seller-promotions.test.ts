import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetSellerPromotions } from './use-get-seller-promotions';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest, setHeader: jest.fn() }),
  },
}));

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
  status: 'ACTIVE',
};

const mockResponse = {
  sellerPromotions: {
    items: [mockPromotion],
    total_count: 1,
    page_size: 20,
    current_page: 1,
  },
};

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useGetSellerPromotions', () => {
  beforeEach(() => mockRequest.mockReset());

  it('returns isLoading true initially', () => {
    mockRequest.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGetSellerPromotions(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns items and totalCount after successful fetch', async () => {
    mockRequest.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGetSellerPromotions(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Summer Sale');
    expect(result.current.totalCount).toBe(1);
    expect(result.current.isError).toBe(false);
  });

  it('returns empty items and totalCount 0 on missing data', async () => {
    mockRequest.mockResolvedValue({ sellerPromotions: null });
    const { result } = renderHook(() => useGetSellerPromotions(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('returns isError true on network failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useGetSellerPromotions(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('passes pageSize and currentPage to the query', async () => {
    mockRequest.mockResolvedValue(mockResponse);
    const { result } = renderHook(
      () => useGetSellerPromotions({ pageSize: 10, currentPage: 2 }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockRequest).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ pageSize: 10, currentPage: 2 })
    );
  });

  it('passes filter to the query when provided', async () => {
    mockRequest.mockResolvedValue(mockResponse);
    const filter = { status: 'ACTIVE' as const };
    const { result } = renderHook(
      () => useGetSellerPromotions({ filter }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockRequest).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ filter })
    );
  });

  it('returns correct pageInfo from response', async () => {
    mockRequest.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGetSellerPromotions(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.pageInfo.pageSize).toBe(20);
    expect(result.current.pageInfo.currentPage).toBe(1);
  });
});
