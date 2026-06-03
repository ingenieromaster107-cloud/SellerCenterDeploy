import { act, renderHook } from '@testing-library/react';

import { useMovementsFilters } from './use-movements-filters';

describe('useMovementsFilters', () => {
  it('initializes with the current month range and no category filter', () => {
    const { result } = renderHook(() => useMovementsFilters());

    expect(result.current.filters.dateFrom).toMatch(/^\d{4}-\d{2}-01$/);
    expect(result.current.filters.dateTo).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.current.filters.categories).toEqual([]);
    expect(result.current.pagination).toEqual({ page: 0, pageSize: 25 });
  });

  it('updates the date range and resets the page', () => {
    const { result } = renderHook(() => useMovementsFilters());

    act(() => result.current.setPagination({ page: 3, pageSize: 25 }));
    act(() => result.current.setDateRange('2024-01-01', '2024-01-31'));

    expect(result.current.filters.dateFrom).toBe('2024-01-01');
    expect(result.current.filters.dateTo).toBe('2024-01-31');
    expect(result.current.pagination.page).toBe(0);
  });

  it('adds a category when toggled on', () => {
    const { result } = renderHook(() => useMovementsFilters());

    act(() => result.current.toggleCategory('VENTA'));

    expect(result.current.filters.categories).toEqual(['VENTA']);
  });

  it('removes a category when toggled off', () => {
    const { result } = renderHook(() => useMovementsFilters());

    act(() => result.current.toggleCategory('VENTA'));
    act(() => result.current.toggleCategory('VENTA'));

    expect(result.current.filters.categories).toEqual([]);
  });

  it('resets the page when a category is toggled', () => {
    const { result } = renderHook(() => useMovementsFilters());

    act(() => result.current.setPagination({ page: 5, pageSize: 25 }));
    act(() => result.current.toggleCategory('COMISION'));

    expect(result.current.pagination.page).toBe(0);
  });
});
