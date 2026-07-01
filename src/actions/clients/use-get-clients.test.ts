import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();
const mockClientsAdapter = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries/get-clients-data', () => ({ GET_CUSTOMERS: 'GET_CUSTOMERS' }));
jest.mock('./adapters/clients-adapter', () => ({ clientsAdapter: (...a: any[]) => mockClientsAdapter(...a) }));

import { useGetClients } from './use-get-clients';

const mockGraphql = { request: jest.fn() };

describe('useGetClients', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockClientsAdapter.mockReturnValue({ items: [], total_count: 0 });
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns customers object', () => {
    const { result } = renderHook(() => useGetClients());
    expect(result.current.customers).toBeDefined();
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { result } = renderHook(() => useGetClients());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    const { result } = renderHook(() => useGetClients());
    expect(result.current.isError).toBe(true);
  });

  it('uses correct queryKey', () => {
    renderHook(() => useGetClients());
    expect(mockUseQuery.mock.calls[0][0].queryKey).toEqual(['getCustomerData']);
  });

  it('maps data through clientsAdapter', () => {
    const customers = { items: [{ id: '1', name: 'Pedro' }], total_count: 1 };
    mockClientsAdapter.mockReturnValue(customers);
    mockUseQuery.mockReturnValue({ data: { sellerCustomers: {} }, isLoading: false, isError: false });
    const { result } = renderHook(() => useGetClients());
    expect(result.current.customers).toBe(customers);
  });
});
