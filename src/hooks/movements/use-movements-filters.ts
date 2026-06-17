import type {
  MovementCategory,
  MovementsFilters,
  MovementsPagination,
} from 'src/sections/movements/types';

import { useState, useCallback } from 'react';

import { today, startOfMonth, FORMAT_PATTERNS } from 'src/utils/format-time';

export function useMovementsFilters() {
  const [filters, setFilters] = useState<MovementsFilters>({
    dateFrom: startOfMonth(FORMAT_PATTERNS.iso.date),
    dateTo: today(FORMAT_PATTERNS.iso.date),
    categories: [],
  });

  const [pagination, setPagination] = useState<MovementsPagination>({
    page: 0,
    pageSize: 25,
  });

  const setDateRange = useCallback((dateFrom: string, dateTo: string) => {
    setFilters((prev) => ({ ...prev, dateFrom, dateTo }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, []);

  const toggleCategory = useCallback((category: MovementCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, []);

  return {
    filters,
    pagination,
    setDateRange,
    toggleCategory,
    setPagination,
  };
}
