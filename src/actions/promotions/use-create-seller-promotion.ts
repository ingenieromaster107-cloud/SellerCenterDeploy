'use client';

import type {
  CreateSellerPromotionInput,
  SellerPromotionMutationResponseRaw,
} from 'src/interfaces/promotions';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { CREATE_SELLER_PROMOTION_MUTATION } from './graphql';
import { SELLER_PROMOTIONS_KEY } from './use-get-seller-promotions';

// ----------------------------------------------------------------------

type Options = {
  onSuccess?: (data: SellerPromotionMutationResponseRaw) => void;
  onError?: (error: Error) => void;
};

export function useCreateSellerPromotion(options: Options = {}) {
  const queryClient = useQueryClient();
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationKey: ['sellerPromotion', 'create'],
    mutationFn: (input: CreateSellerPromotionInput) =>
      graphql
        .request<
          { createSellerPromotion: SellerPromotionMutationResponseRaw },
          { input: CreateSellerPromotionInput }
        >(CREATE_SELLER_PROMOTION_MUTATION, { input })
        .then((res) => res.createSellerPromotion),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: SELLER_PROMOTIONS_KEY });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
