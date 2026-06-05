'use client';

import type {
  UpdateSellerPromotionInput,
  SellerPromotionMutationResponseRaw,
} from 'src/interfaces/promotions';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { UPDATE_SELLER_PROMOTION_MUTATION } from './graphql';
import { SELLER_PROMOTIONS_KEY } from './use-get-seller-promotions';
import { SELLER_PROMOTION_DETAIL_KEY } from './use-get-seller-promotion-detail';

// ----------------------------------------------------------------------

type Variables = { promotion_id: number; input: UpdateSellerPromotionInput };

type Options = {
  onSuccess?: (data: SellerPromotionMutationResponseRaw) => void;
  onError?: (error: Error) => void;
};

export function useUpdateSellerPromotion(options: Options = {}) {
  const queryClient = useQueryClient();
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationKey: ['sellerPromotion', 'update'],
    mutationFn: ({ promotion_id, input }: Variables) =>
      graphql
        .request<
          { updateSellerPromotion: SellerPromotionMutationResponseRaw },
          Variables
        >(UPDATE_SELLER_PROMOTION_MUTATION, { promotion_id, input })
        .then((res) => res.updateSellerPromotion),
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
