'use client';

import { useMemo } from 'react';

import { useGetSellerReputationIndicators } from 'src/actions/dashboard/use-get-seller-reputation-indicators';

export function useSellerReputationIndicators() {
  const { reputation, isLoading, isError } = useGetSellerReputationIndicators();

  const hasLiveData = useMemo(
    () => Boolean(reputation.success && reputation.data && !reputation.data.insufficient_data),
    [reputation.data, reputation.success]
  );

  return {
    reputation,
    hasLiveData,
    isLoading,
    isError,
  };
}
