'use client';

import { gql } from 'graphql-request';

export const DELETE_SELLER_PROMOTION_MUTATION = gql`
  mutation DeleteSellerPromotion($promotion_id: Int!) {
    deleteSellerPromotion(promotion_id: $promotion_id) {
      success
      message
    }
  }
`;
