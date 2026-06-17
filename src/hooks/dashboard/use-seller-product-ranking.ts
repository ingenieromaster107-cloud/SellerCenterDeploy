import dayjs from 'dayjs';
import { useMemo } from 'react';

import { FORMAT_PATTERNS } from 'src/utils/format-time';

import { useGetSellerProductRanking } from 'src/actions/dashboard/use-get-seller-product-ranking';

function getDefaultRange() {
  const toDate = dayjs();
  return {
    fromDate: toDate.subtract(30, 'day').format(FORMAT_PATTERNS.iso.date),
    toDate: toDate.format(FORMAT_PATTERNS.iso.date),
  };
}

export function useSellerProductRanking() {
  const range = useMemo(() => getDefaultRange(), []);
  const { ranking, isLoading, isError } = useGetSellerProductRanking(range);

  return {
    items: ranking.data,
    totalCount: ranking.total_count,
    isLoading,
    isError,
  };
}
