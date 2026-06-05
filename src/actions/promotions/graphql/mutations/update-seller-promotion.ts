'use client';

import { gql } from 'graphql-request';

export const UPDATE_SELLER_PROMOTION_MUTATION = gql`
  mutation UpdateSellerPromotion($promotion_id: Int!, $input: UpdateSellerPromotionInput!) {
    updateSellerPromotion(promotion_id: $promotion_id, input: $input) {
      success
      message
      promotion {
        entity_id
        name
        discount_amount
        status
        updated_at
      }
    }
  }
`;
