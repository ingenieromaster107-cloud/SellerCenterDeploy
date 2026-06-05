'use client';

import { gql } from 'graphql-request';

export const PAUSE_SELLER_PROMOTION_MUTATION = gql`
  mutation PauseSellerPromotion($promotion_id: Int!) {
    pauseSellerPromotion(promotion_id: $promotion_id) {
      success
      message
      promotion {
        entity_id
        status
      }
    }
  }
`;
