'use client';

import type { SellerPromotionDetailResponseRaw } from 'src/interfaces/promotions';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_SELLER_PROMOTION_DETAIL_QUERY } from './graphql';

// ----------------------------------------------------------------------

export const SELLER_PROMOTION_DETAIL_KEY = (id: number) => ['sellerPromotion', id];

export function useGetSellerPromotionDetail(promotionId: number | null) {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: SELLER_PROMOTION_DETAIL_KEY(promotionId ?? 0),
    queryFn: () =>
      graphql.request<SellerPromotionDetailResponseRaw, { promotion_id: number }>(
        GET_SELLER_PROMOTION_DETAIL_QUERY,
        { promotion_id: promotionId! }
      ),
    enabled: promotionId !== null && promotionId > 0,
  });

  return {
    promotion: data?.sellerPromotion?.promotion ?? null,
    stats: data?.sellerPromotion?.stats ?? null,
    isLoading,
    isError,
  };
}
