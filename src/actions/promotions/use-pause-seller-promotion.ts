'use client';

import type { SellerPromotionMutationResponseRaw } from 'src/interfaces/promotions';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { PAUSE_SELLER_PROMOTION_MUTATION } from './graphql';
import { SELLER_PROMOTIONS_KEY } from './use-get-seller-promotions';
import { SELLER_PROMOTION_DETAIL_KEY } from './use-get-seller-promotion-detail';

// ----------------------------------------------------------------------

type Options = {
  onSuccess?: (data: SellerPromotionMutationResponseRaw) => void;
  onError?: (error: Error) => void;
};

export function usePauseSellerPromotion(options: Options = {}) {
  const queryClient = useQueryClient();
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationKey: ['sellerPromotion', 'pause'],
    mutationFn: (promotion_id: number) =>
      graphql
        .request<
          { pauseSellerPromotion: SellerPromotionMutationResponseRaw },
          { promotion_id: number }
        >(PAUSE_SELLER_PROMOTION_MUTATION, { promotion_id })
        .then((res) => res.pauseSellerPromotion),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: SELLER_PROMOTIONS_KEY });
      await queryClient.invalidateQueries({
        queryKey: SELLER_PROMOTION_DETAIL_KEY(data.promotion.entity_id),
      });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
