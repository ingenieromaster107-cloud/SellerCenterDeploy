import type { LoyaltyClassification } from 'src/interfaces/clients/seller-loyalty';

import dayjs from 'dayjs';
import { useMemo } from 'react';

import { FORMAT_PATTERNS } from 'src/utils/format-time';

import { useGetSellerLoyalty } from 'src/actions/clients/use-get-seller-loyalty';

export type CustomerLoyalty = {
  classification: LoyaltyClassification;
  ordersCount: number;
};

function getDefaultRange() {
  const toDate = dayjs();
  return {
    fromDate: toDate.subtract(2, 'year').format(FORMAT_PATTERNS.iso.date),
    toDate: toDate.format(FORMAT_PATTERNS.iso.date),
  };
}

export function useSellerLoyalty() {
  const range = useMemo(() => getDefaultRange(), []);
  const { loyalty, isLoading, isError } = useGetSellerLoyalty(range);

  const loyaltyByEmail = useMemo(() => {
    const map = new Map<string, CustomerLoyalty>();
    loyalty.data.customers.forEach((customer) => {
      map.set(customer.email.trim().toLowerCase(), {
        classification: customer.classification,
        ordersCount: customer.orders_count,
      });
    });
    return map;
  }, [loyalty.data.customers]);

  return {
    summary: loyalty.data,
    loyaltyByEmail,
    isLoading,
    isError,
  };
}
