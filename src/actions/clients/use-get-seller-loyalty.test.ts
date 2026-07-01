import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();
const mockLoyaltyAdapter = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries/get-seller-loyalty', () => ({ GET_SELLER_LOYALTY_QUERY: 'GET_SELLER_LOYALTY_QUERY' }));
jest.mock('./adapters/seller-loyalty-adapter', () => ({ sellerLoyaltyAdapter: (...a: any[]) => mockLoyaltyAdapter(...a) }));

import { useGetSellerLoyalty } from './use-get-seller-loyalty';

const mockGraphql = { request: jest.fn() };
const dateRange = { fromDate: '2026-01-01', toDate: '2026-01-31' };

describe('useGetSellerLoyalty', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockLoyaltyAdapter.mockReturnValue({ data: null, totalCustomers: 0 });
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns loyalty data', () => {
    const { result } = renderHook(() => useGetSellerLoyalty(dateRange));
    expect(result.current.loyalty).toBeDefined();
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { result } = renderHook(() => useGetSellerLoyalty(dateRange));
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    const { result } = renderHook(() => useGetSellerLoyalty(dateRange));
    expect(result.current.isError).toBe(true);
  });

  it('uses correct queryKey with dates', () => {
    renderHook(() => useGetSellerLoyalty(dateRange));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey).toEqual(['sellerLoyalty', '2026-01-01', '2026-01-31']);
  });
});
