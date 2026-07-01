import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries', () => ({ SELLER_MOVEMENTS_SUMMARY_QUERY: 'SELLER_MOVEMENTS_SUMMARY_QUERY' }));

import { useGetMovementsSummary } from './use-get-movements-summary';

const mockGraphql = { request: jest.fn() };

describe('useGetMovementsSummary', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, isFetching: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns summary undefined when no data', () => {
    const { result } = renderHook(() => useGetMovementsSummary('2026-01-01', '2026-01-31'));
    expect(result.current.summary).toBeUndefined();
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false, isFetching: true });
    const { result } = renderHook(() => useGetMovementsSummary('2026-01-01', '2026-01-31'));
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true, isFetching: false });
    const { result } = renderHook(() => useGetMovementsSummary('2026-01-01', '2026-01-31'));
    expect(result.current.isError).toBe(true);
  });

  it('is disabled when dateFrom is empty', () => {
    renderHook(() => useGetMovementsSummary('', '2026-01-31'));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.enabled).toBe(false);
  });

  it('is disabled when dateTo is empty', () => {
    renderHook(() => useGetMovementsSummary('2026-01-01', ''));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.enabled).toBe(false);
  });

  it('is enabled when both dates provided', () => {
    renderHook(() => useGetMovementsSummary('2026-01-01', '2026-01-31'));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.enabled).toBe(true);
  });

  it('returns summary from data', () => {
    const summary = { total_income: '1000', total_expenses: '200' } as any;
    mockUseQuery.mockReturnValue({ data: summary, isLoading: false, isError: false, isFetching: false });
    const { result } = renderHook(() => useGetMovementsSummary('2026-01-01', '2026-01-31'));
    expect(result.current.summary).toBe(summary);
  });
});
