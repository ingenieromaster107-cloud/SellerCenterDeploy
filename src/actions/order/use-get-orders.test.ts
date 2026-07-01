import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./queries/get-order-data', () => ({ GET_ORDERS: 'GET_ORDERS' }));

import { useGetOrders } from './use-get-orders';

const mockGraphql = { request: jest.fn() };
const pagination = { pageSize: 10, currentPage: 1 } as any;

describe('useGetOrders', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns default totalCount 0 when no data', () => {
    const { result } = renderHook(() => useGetOrders(pagination));
    expect(result.current.totalCount).toBe(0);
    expect(result.current.pageInfo).toBeUndefined();
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { result } = renderHook(() => useGetOrders(pagination));
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    const { result } = renderHook(() => useGetOrders(pagination));
    expect(result.current.isError).toBe(true);
  });

  it('returns totalCount and pageInfo from data', () => {
    const pageInfo = { current_page: 1, page_size: 10, total_pages: 3 };
    mockUseQuery.mockReturnValue({
      data: { sellerOrders: { total_count: 25, page_info: pageInfo, items: [] } },
      isLoading: false,
      isError: false,
    });
    const { result } = renderHook(() => useGetOrders(pagination));
    expect(result.current.totalCount).toBe(25);
    expect(result.current.pageInfo).toBe(pageInfo);
  });

  it('uses correct queryKey', () => {
    renderHook(() => useGetOrders(pagination));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey[0]).toBe('graphql:getOrders');
  });
});
