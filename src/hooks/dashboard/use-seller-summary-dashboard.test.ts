import { renderHook } from '@testing-library/react';

const mockUseGetSellerSummaryDashboard = jest.fn();

jest.mock('src/actions/dashboard/use-get-seller-summary-dashboard', () => ({
  useGetSellerSummaryDashboard: (...args: any[]) => mockUseGetSellerSummaryDashboard(...args),
}));

import { useSellerSummaryDashboard } from './use-seller-summary-dashboard';

const setSummary = (
  summary: { success: boolean; data: object | null; message: string },
  extra: { isLoading?: boolean; isError?: boolean } = {}
) => {
  mockUseGetSellerSummaryDashboard.mockReturnValue({
    summary,
    isLoading: extra.isLoading ?? false,
    isError: extra.isError ?? false,
  });
};

describe('useSellerSummaryDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns hasLiveData true when success is true and data is present', () => {
    setSummary({ success: true, data: { sales_account: {} }, message: 'ok' });
    const { result } = renderHook(() => useSellerSummaryDashboard());
    expect(result.current.hasLiveData).toBe(true);
  });

  it('returns hasLiveData false when success is false', () => {
    setSummary({ success: false, data: null, message: '' });
    const { result } = renderHook(() => useSellerSummaryDashboard());
    expect(result.current.hasLiveData).toBe(false);
  });

  it('returns hasLiveData false when data is null even if success is true', () => {
    setSummary({ success: true, data: null, message: '' });
    const { result } = renderHook(() => useSellerSummaryDashboard());
    expect(result.current.hasLiveData).toBe(false);
  });

  it('passes through isLoading', () => {
    setSummary({ success: false, data: null, message: '' }, { isLoading: true });
    const { result } = renderHook(() => useSellerSummaryDashboard());
    expect(result.current.isLoading).toBe(true);
  });

  it('passes through isError', () => {
    setSummary({ success: false, data: null, message: '' }, { isError: true });
    const { result } = renderHook(() => useSellerSummaryDashboard());
    expect(result.current.isError).toBe(true);
  });

  it('passes dateRange argument to underlying action hook', () => {
    setSummary({ success: false, data: null, message: '' }, { isLoading: true });
    const range = { fromDate: '2026-01-01', toDate: '2026-01-31' };
    renderHook(() => useSellerSummaryDashboard(range));
    expect(mockUseGetSellerSummaryDashboard).toHaveBeenCalledWith(range);
  });

  it('calls underlying action hook with undefined when no dateRange provided', () => {
    setSummary({ success: false, data: null, message: '' });
    renderHook(() => useSellerSummaryDashboard());
    expect(mockUseGetSellerSummaryDashboard).toHaveBeenCalledWith(undefined);
  });

  it('passes summary object through to return value', () => {
    const summary = { success: true, data: { sales_account: {} }, message: 'ok' };
    setSummary(summary);
    const { result } = renderHook(() => useSellerSummaryDashboard());
    expect(result.current.summary).toEqual(summary);
  });
});
