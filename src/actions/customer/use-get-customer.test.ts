import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();
const mockCustomerAdapter = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries/get-customer', () => ({ GET_CUSTOMER: 'GET_CUSTOMER' }));
jest.mock('./adapters/customer-adapter', () => ({ CustomerAdapter: (...a: any[]) => mockCustomerAdapter(...a) }));

import { useGetCustomer } from './use-get-customer';

const mockGraphql = { request: jest.fn() };

describe('useGetCustomer', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockCustomerAdapter.mockReturnValue(null);
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns customer null when no data', () => {
    const { result } = renderHook(() => useGetCustomer());
    expect(result.current.customer).toBeNull();
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false, error: null });
    const { result } = renderHook(() => useGetCustomer());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError and error', () => {
    const err = new Error('not found');
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true, error: err });
    const { result } = renderHook(() => useGetCustomer());
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(err);
  });

  it('uses correct queryKey', () => {
    renderHook(() => useGetCustomer());
    expect(mockUseQuery.mock.calls[0][0].queryKey).toEqual(['getCustomer']);
  });

  it('maps data through CustomerAdapter', () => {
    const customer = { name: 'Ana', email: 'ana@test.com' };
    mockCustomerAdapter.mockReturnValue(customer);
    mockUseQuery.mockReturnValue({ data: { customer: {} }, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useGetCustomer());
    expect(result.current.customer).toBe(customer);
  });
});
