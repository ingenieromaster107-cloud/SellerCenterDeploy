import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./queries/get-order-detail', () => ({ GET_ORDER_DETAIL: 'GET_ORDER_DETAIL' }));

import { useGetOrderDetail } from './use-order-details';

const mockGraphql = { request: jest.fn() };

describe('useGetOrderDetail', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns query result', () => {
    const { result } = renderHook(() => useGetOrderDetail('ORD-001'));
    expect(result.current).toBeDefined();
  });

  it('passes correct queryKey with incrementId', () => {
    renderHook(() => useGetOrderDetail('ORD-123'));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey[0]).toBe('graphql:getOrderDetail');
    expect(opts.queryKey[1]).toEqual({ increment_id: 'ORD-123' });
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { result } = renderHook(() => useGetOrderDetail('ORD-001'));
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    const { result } = renderHook(() => useGetOrderDetail('ORD-001'));
    expect(result.current.isError).toBe(true);
  });

  it('returns data when available', () => {
    const orderData = { sellerOrder: { increment_id: 'ORD-001', status: 'complete' } } as any;
    mockUseQuery.mockReturnValue({ data: orderData, isLoading: false, isError: false });
    const { result } = renderHook(() => useGetOrderDetail('ORD-001'));
    expect(result.current.data).toBe(orderData);
  });
});
