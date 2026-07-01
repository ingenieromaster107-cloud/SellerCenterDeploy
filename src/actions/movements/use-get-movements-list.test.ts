import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQuery: (...a: any[]) => mockUseQuery(...a),
  keepPreviousData: 'keepPreviousData',
}));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries', () => ({ SELLER_MOVEMENTS_QUERY: 'SELLER_MOVEMENTS_QUERY' }));

import { useGetMovementsList } from './use-get-movements-list';

const mockGraphql = { request: jest.fn() };
const defaultFilters = { dateFrom: '2026-01-01', dateTo: '2026-01-31', categories: [] };
const defaultPagination = { page: 0, pageSize: 10 };

describe('useGetMovementsList', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, isFetching: false, refetch: jest.fn() });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns empty items when no data', () => {
    const { result } = renderHook(() => useGetMovementsList(defaultFilters, defaultPagination));
    expect(result.current.items).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('returns isLoading and isFetching flags', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isFetching: true, isError: false, refetch: jest.fn() });
    const { result } = renderHook(() => useGetMovementsList(defaultFilters, defaultPagination));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
  });

  it('returns isError flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isFetching: false, isError: true, refetch: jest.fn() });
    const { result } = renderHook(() => useGetMovementsList(defaultFilters, defaultPagination));
    expect(result.current.isError).toBe(true);
  });

  it('returns items and totalCount from data', () => {
    const items = [{ id: '1', type: 'sale', amount: 100 }];
    mockUseQuery.mockReturnValue({ data: { items, total_count: 1 }, isLoading: false, isFetching: false, isError: false, refetch: jest.fn() });
    const { result } = renderHook(() => useGetMovementsList(defaultFilters, defaultPagination));
    expect(result.current.items).toBe(items);
    expect(result.current.totalCount).toBe(1);
  });

  it('returns refetch function', () => {
    const refetch = jest.fn();
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isFetching: false, isError: false, refetch });
    const { result } = renderHook(() => useGetMovementsList(defaultFilters, defaultPagination));
    expect(result.current.refetch).toBe(refetch);
  });

  it('uses correct queryKey', () => {
    renderHook(() => useGetMovementsList(defaultFilters, defaultPagination));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey[0]).toBe('movements:list');
  });
});
