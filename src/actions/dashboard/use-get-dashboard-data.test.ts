import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();
const mockDashboardAdapter = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries/get-dashboard-data', () => ({ GET_DASHBOARD_DATA_QUERY: 'GET_DASHBOARD_DATA_QUERY' }));
jest.mock('./adapters/dashboard-data-adapter', () => ({ dashboardDataAdapter: (...a: any[]) => mockDashboardAdapter(...a) }));

import { useGetDashboardData } from './use-get-dashboard-data';

const mockGraphql = { request: jest.fn() };

describe('useGetDashboardData', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockDashboardAdapter.mockReturnValue({ message: '', success: false, data: [] });
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns returns object', () => {
    const { result } = renderHook(() => useGetDashboardData({ today: '2026-01-07', sevenDaysAgo: '2026-01-01' }));
    expect(result.current.returns).toBeDefined();
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { result } = renderHook(() => useGetDashboardData({ today: '2026-01-07', sevenDaysAgo: '2026-01-01' }));
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    const { result } = renderHook(() => useGetDashboardData({ today: '2026-01-07', sevenDaysAgo: '2026-01-01' }));
    expect(result.current.isError).toBe(true);
  });

  it('passes enabled=false when no dateRange', () => {
    renderHook(() => useGetDashboardData(undefined));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.enabled).toBe(false);
  });

  it('passes enabled=true with dateRange', () => {
    renderHook(() => useGetDashboardData({ today: '2026-01-07', sevenDaysAgo: '2026-01-01' }));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.enabled).toBe(true);
  });
});
