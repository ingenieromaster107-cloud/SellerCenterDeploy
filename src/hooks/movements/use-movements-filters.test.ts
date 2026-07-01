import { act, renderHook } from '@testing-library/react';

import { useMovementsFilters } from './use-movements-filters';

jest.mock('src/utils/format-time', () => ({
  today: () => '2026-06-22',
  startOfMonth: () => '2026-06-01',
  FORMAT_PATTERNS: { iso: { date: 'YYYY-MM-DD' } },
}));

describe('useMovementsFilters', () => {
  it('initializes filters with dateFrom and dateTo', () => {
    const { result } = renderHook(() => useMovementsFilters());

    expect(result.current.filters.dateFrom).toBe('2026-06-01');
    expect(result.current.filters.dateTo).toBe('2026-06-22');
    expect(result.current.filters.categories).toEqual([]);
  });

  it('initializes pagination with page=0, pageSize=25', () => {
    const { result } = renderHook(() => useMovementsFilters());

    expect(result.current.pagination.page).toBe(0);
    expect(result.current.pagination.pageSize).toBe(25);
  });

  it('setDateRange updates dateFrom and dateTo', () => {
    const { result } = renderHook(() => useMovementsFilters());

    act(() => {
      result.current.setDateRange('2026-05-01', '2026-05-31');
    });

    expect(result.current.filters.dateFrom).toBe('2026-05-01');
    expect(result.current.filters.dateTo).toBe('2026-05-31');
  });

  it('setDateRange resets page to 0', () => {
    const { result } = renderHook(() => useMovementsFilters());

    act(() => {
      result.current.setPagination(prev => ({ ...prev, page: 3 }));
    });

    expect(result.current.pagination.page).toBe(3);

    act(() => {
      result.current.setDateRange('2026-05-01', '2026-05-31');
    });

    expect(result.current.pagination.page).toBe(0);
  });

  it('toggleCategory adds category to array', () => {
    const { result } = renderHook(() => useMovementsFilters());

    act(() => {
      result.current.toggleCategory('VENTA');
    });

    expect(result.current.filters.categories).toContain('VENTA');
  });

  it('toggleCategory removes category if already present', () => {
    const { result } = renderHook(() => useMovementsFilters());

    act(() => {
      result.current.toggleCategory('VENTA');
    });

    expect(result.current.filters.categories).toContain('VENTA');

    act(() => {
      result.current.toggleCategory('VENTA');
    });

    expect(result.current.filters.categories).not.toContain('VENTA');
  });

  it('toggleCategory resets page to 0', () => {
    const { result } = renderHook(() => useMovementsFilters());

    act(() => {
      result.current.setPagination(prev => ({ ...prev, page: 2 }));
    });

    expect(result.current.pagination.page).toBe(2);

    act(() => {
      result.current.toggleCategory('DEVOLUCION');
    });

    expect(result.current.pagination.page).toBe(0);
  });
});
