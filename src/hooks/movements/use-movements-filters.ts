import type {
  MovementCategory,
  MovementsFilters,
  MovementsPagination,
} from 'src/sections/movements/types';

import { useState, useCallback } from 'react';

import { today, startOfMonth } from 'src/utils/format-time';

const ISO_DATE = 'YYYY-MM-DD';

export function useMovementsFilters() {
  const [filters, setFilters] = useState<MovementsFilters>({
    dateFrom: startOfMonth(ISO_DATE),
    dateTo: today(ISO_DATE),
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
