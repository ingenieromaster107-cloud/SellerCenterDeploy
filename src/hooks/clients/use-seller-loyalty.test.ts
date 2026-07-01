import { renderHook } from '@testing-library/react';

const mockUseGetSellerLoyalty = jest.fn();

jest.mock('src/actions/clients/use-get-seller-loyalty', () => ({
  useGetSellerLoyalty: (...args: any[]) => mockUseGetSellerLoyalty(...args),
}));

jest.mock('src/utils/format-time', () => ({
  FORMAT_PATTERNS: { iso: { date: 'YYYY-MM-DD' } },
}));

jest.mock('dayjs', () => {
  const m = () => ({
    subtract: () => m(),
    format: () => '2026-01-01',
  });
  return m;
});

import { useSellerLoyalty } from './use-seller-loyalty';

const emptyLoyalty = {
  success: false,
  message: '',
  data: { total_customers: 0, new_customers: 0, frequent_customers: 0, loyalty_rate: 0, customers: [] },
};

describe('useSellerLoyalty', () => {
  beforeEach(() => {
    mockUseGetSellerLoyalty.mockReturnValue({
      loyalty: emptyLoyalty,
      isLoading: false,
      isError: false,
    });
  });

  it('returns summary from loyalty.data', () => {
    const { result } = renderHook(() => useSellerLoyalty());
    expect(result.current.summary).toEqual(emptyLoyalty.data);
  });

  it('returns empty loyaltyByEmail map when no customers', () => {
    const { result } = renderHook(() => useSellerLoyalty());
    expect(result.current.loyaltyByEmail.size).toBe(0);
  });

  it('builds loyaltyByEmail map from customers', () => {
    mockUseGetSellerLoyalty.mockReturnValue({
      loyalty: {
        ...emptyLoyalty,
        data: {
          ...emptyLoyalty.data,
          customers: [
            { email: 'Alice@Test.COM', classification: 'FREQUENT', orders_count: 5 },
            { email: 'bob@test.com', classification: 'NEW', orders_count: 1 },
          ],
        },
      },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useSellerLoyalty());
    expect(result.current.loyaltyByEmail.size).toBe(2);
    expect(result.current.loyaltyByEmail.get('alice@test.com')).toEqual({
      classification: 'FREQUENT',
      ordersCount: 5,
    });
    expect(result.current.loyaltyByEmail.get('bob@test.com')).toEqual({
      classification: 'NEW',
      ordersCount: 1,
    });
  });

  it('normalizes email to lowercase', () => {
    mockUseGetSellerLoyalty.mockReturnValue({
      loyalty: {
        ...emptyLoyalty,
        data: { ...emptyLoyalty.data, customers: [{ email: 'UPPER@TEST.COM', classification: 'NEW', orders_count: 2 }] },
      },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useSellerLoyalty());
    expect(result.current.loyaltyByEmail.has('upper@test.com')).toBe(true);
  });

  it('returns isLoading from action', () => {
    mockUseGetSellerLoyalty.mockReturnValue({ loyalty: emptyLoyalty, isLoading: true, isError: false });
    const { result } = renderHook(() => useSellerLoyalty());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError from action', () => {
    mockUseGetSellerLoyalty.mockReturnValue({ loyalty: emptyLoyalty, isLoading: false, isError: true });
    const { result } = renderHook(() => useSellerLoyalty());
    expect(result.current.isError).toBe(true);
  });
});
