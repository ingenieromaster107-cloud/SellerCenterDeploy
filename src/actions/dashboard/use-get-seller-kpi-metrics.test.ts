import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();
const mockKpiAdapter = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries/get-seller-kpi-metrics', () => ({ GET_SELLER_KPI_METRICS_QUERY: 'GET_SELLER_KPI_METRICS_QUERY' }));
jest.mock('./adapters/seller-kpi-metrics-adapter', () => ({ sellerKpiMetricsAdapter: (...a: any[]) => mockKpiAdapter(...a) }));

import { useGetSellerKpiMetrics } from './use-get-seller-kpi-metrics';

const mockGraphql = { request: jest.fn() };
const vars = { fromDate: '2026-01-01', toDate: '2026-01-31' };

describe('useGetSellerKpiMetrics', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockKpiAdapter.mockReturnValue({});
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns metrics object', () => {
    const { result } = renderHook(() => useGetSellerKpiMetrics(vars));
    expect(result.current.metrics).toBeDefined();
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { result } = renderHook(() => useGetSellerKpiMetrics(vars));
    expect(result.current.isLoading).toBe(true);
  });

  it('defaults compareFromDate and compareToDate to null in queryKey', () => {
    renderHook(() => useGetSellerKpiMetrics(vars));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey).toContain(null);
  });

  it('uses provided compare dates in queryKey', () => {
    const withCompare = { ...vars, compareFromDate: '2025-12-01', compareToDate: '2025-12-31' };
    renderHook(() => useGetSellerKpiMetrics(withCompare));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey).toContain('2025-12-01');
    expect(opts.queryKey).toContain('2025-12-31');
  });

  it('returns isError flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    const { result } = renderHook(() => useGetSellerKpiMetrics(vars));
    expect(result.current.isError).toBe(true);
  });
});
