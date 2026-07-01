import type { SellerProductRankingResult } from 'src/interfaces/dashboard/seller-product-ranking';

import { renderHook } from '@testing-library/react';

jest.mock('src/utils/format-time', () => ({
  FORMAT_PATTERNS: { iso: { date: 'YYYY-MM-DD' } },
}));

jest.mock('dayjs', () => {
  const m = () => ({ subtract: () => m(), format: () => '2026-01-01' });
  return m;
});

const mockUseGetSellerProductRanking = jest.fn();

jest.mock('src/actions/dashboard/use-get-seller-product-ranking', () => ({
  useGetSellerProductRanking: (...args: any[]) => mockUseGetSellerProductRanking(...args),
}));

import { useSellerProductRanking } from './use-seller-product-ranking';

const emptyRanking: SellerProductRankingResult = {
  success: false,
  message: '',
  total_count: 0,
  data: [],
};

const setRanking = (
  ranking: SellerProductRankingResult,
  extra: { isLoading?: boolean; isError?: boolean } = {}
) => {
  mockUseGetSellerProductRanking.mockReturnValue({
    ranking,
    isLoading: extra.isLoading ?? false,
    isError: extra.isError ?? false,
  });
};

describe('useSellerProductRanking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns items as empty array when ranking.data is empty', () => {
    setRanking(emptyRanking);
    const { result } = renderHook(() => useSellerProductRanking());
    expect(result.current.items).toEqual([]);
  });

  it('returns totalCount from ranking.total_count', () => {
    setRanking({ ...emptyRanking, total_count: 42 });
    const { result } = renderHook(() => useSellerProductRanking());
    expect(result.current.totalCount).toBe(42);
  });

  it('returns items when ranking.data has entries', () => {
    const item = {
      product_id: 1,
      sku: 'SKU-001',
      product_name: 'Product A',
      gross_sales: 1000,
      units_sold: 10,
      visits: 200,
      participation: 25,
    };
    setRanking({ success: true, message: 'ok', total_count: 1, data: [item] });
    const { result } = renderHook(() => useSellerProductRanking());
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items![0]).toEqual(item);
  });

  it('passes isLoading through', () => {
    setRanking(emptyRanking, { isLoading: true });
    const { result } = renderHook(() => useSellerProductRanking());
    expect(result.current.isLoading).toBe(true);
  });

  it('passes isError through', () => {
    setRanking(emptyRanking, { isError: true });
    const { result } = renderHook(() => useSellerProductRanking());
    expect(result.current.isError).toBe(true);
  });

  it('calls underlying action hook with a date range object', () => {
    setRanking(emptyRanking);
    renderHook(() => useSellerProductRanking());
    expect(mockUseGetSellerProductRanking).toHaveBeenCalledWith(
      expect.objectContaining({ fromDate: expect.any(String), toDate: expect.any(String) })
    );
  });

  it('stabilises the range across re-renders via useMemo', () => {
    setRanking(emptyRanking);
    const { rerender } = renderHook(() => useSellerProductRanking());
    rerender();
    const calls = mockUseGetSellerProductRanking.mock.calls;
    expect(calls[0][0]).toBe(calls[1][0]);
  });
});
