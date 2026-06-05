'use client';

import { gql } from 'graphql-request';

export const ACTIVATE_SELLER_PROMOTION_MUTATION = gql`
  mutation ActivateSellerPromotion($promotion_id: Int!) {
    activateSellerPromotion(promotion_id: $promotion_id) {
      success
      message
      promotion {
        entity_id
        status
      }
    }
  }
`;
