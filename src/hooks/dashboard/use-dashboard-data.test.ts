import { renderHook } from '@testing-library/react';

const mockUseGetDashboardData = jest.fn();

jest.mock('src/actions/dashboard/use-get-dashboard-data', () => ({
  useGetDashboardData: (...args: any[]) => mockUseGetDashboardData(...args),
}));

import { useDashboardData } from './use-dashboard-data';

const emptyResult = { returns: { message: '', success: false, data: [] }, isLoading: false };

describe('useDashboardData', () => {
  beforeEach(() => {
    mockUseGetDashboardData.mockReturnValue(emptyResult);
  });

  it('returns dashboardData as empty array when no data', () => {
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.dashboardData).toEqual([]);
  });

  it('returns default topProducts as empty array', () => {
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.topProducts).toEqual([]);
  });

  it('returns default topCustomers as empty array', () => {
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.topCustomers).toEqual([]);
  });

  it('returns isLoading from action', () => {
    mockUseGetDashboardData.mockReturnValue({ ...emptyResult, isLoading: true });
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.isLoading).toBe(true);
  });

  it('maps topProducts when top_sale_products present in data', () => {
    mockUseGetDashboardData.mockReturnValue({
      returns: {
        message: '',
        success: true,
        data: [
          {
            top_sale_products: [
              { name: 'Product A', image_url: 'https://img.com/a.jpg', qty: 10 },
              { name: 'Product B', image_url: 'https://img.com/b.jpg', qty: 5 },
            ],
          },
        ],
      },
      isLoading: false,
    });

    const { result } = renderHook(() => useDashboardData());
    expect(result.current.topProducts).toHaveLength(2);
    expect(result.current.topProducts[0].name).toBe('Product A');
    expect(result.current.topProducts[0].totalFavorites).toBe(10);
    expect(result.current.topProducts[0].id).toBe('1');
  });

  it('maps topCustomers when top_customers present in data', () => {
    mockUseGetDashboardData.mockReturnValue({
      returns: {
        message: '',
        success: true,
        data: [
          {
            top_customers: [
              { name: 'Alice', email: 'alice@test.com' },
              { name: 'Bob', email: 'bob@test.com' },
            ],
          },
        ],
      },
      isLoading: false,
    });

    const { result } = renderHook(() => useDashboardData());
    expect(result.current.topCustomers).toHaveLength(2);
    expect(result.current.topCustomers[0].name).toBe('Alice');
    expect(result.current.topCustomers[1].email).toBe('bob@test.com');
  });

  it('returns averageOrderValue defaults when not present', () => {
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.averageOrderValue.avg_order_value).toBe('0');
  });

  it('returns totalSales defaults when not present', () => {
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.totalSales.total_sale).toBe('0');
  });
});
