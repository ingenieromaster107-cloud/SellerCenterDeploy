'use client';

import type { SellerPromotionDeleteResponseRaw } from 'src/interfaces/promotions';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { DELETE_SELLER_PROMOTION_MUTATION } from './graphql';
import { SELLER_PROMOTIONS_KEY } from './use-get-seller-promotions';

// ----------------------------------------------------------------------

type Options = {
  onSuccess?: (data: SellerPromotionDeleteResponseRaw) => void;
  onError?: (error: Error) => void;
};

export function useDeleteSellerPromotion(options: Options = {}) {
  const queryClient = useQueryClient();
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationKey: ['sellerPromotion', 'delete'],
    mutationFn: (promotion_id: number) =>
      graphql
        .request<
          { deleteSellerPromotion: SellerPromotionDeleteResponseRaw },
          { promotion_id: number }
        >(DELETE_SELLER_PROMOTION_MUTATION, { promotion_id })
        .then((res) => res.deleteSellerPromotion),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: SELLER_PROMOTIONS_KEY });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
