import { renderHook } from '@testing-library/react';

import { useClientList } from './use-client-list';

const mockUseGetClients = jest.fn();
jest.mock('src/actions/clients/use-get-clients', () => ({
  useGetClients: (...args: any[]) => mockUseGetClients(...args),
}));
jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

describe('useClientList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns clientList from customers.data', () => {
    const mockData = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
    mockUseGetClients.mockReturnValue({
      customers: { data: mockData, total_count: 2 },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useClientList());

    expect(result.current.clientList).toEqual(mockData);
  });

  it('returns [] when customers is undefined', () => {
    mockUseGetClients.mockReturnValue({
      customers: undefined,
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useClientList());

    expect(result.current.clientList).toEqual([]);
  });

  it('returns total from customers.total_count', () => {
    mockUseGetClients.mockReturnValue({
      customers: { data: [], total_count: 42 },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useClientList());

    expect(result.current.total).toBe(42);
  });

  it('returns 0 for total when customers undefined', () => {
    mockUseGetClients.mockReturnValue({
      customers: undefined,
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useClientList());

    expect(result.current.total).toBe(0);
  });

  it('returns isLoading flag', () => {
    mockUseGetClients.mockReturnValue({
      customers: undefined,
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(() => useClientList());

    expect(result.current.isLoading).toBe(true);
  });

  it('tableHead has 6 items', () => {
    mockUseGetClients.mockReturnValue({
      customers: undefined,
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useClientList());

    expect(result.current.tableHead).toHaveLength(6);
  });
});
