'use client';

import { gql } from 'graphql-request';

export const CREATE_SELLER_PROMOTION_MUTATION = gql`
  mutation CreateSellerPromotion($input: CreateSellerPromotionInput!) {
    createSellerPromotion(input: $input) {
      success
      message
      promotion {
        entity_id
        name
        status
        discount_type
        apply_type
        discount_amount
        coupon_code
        from_date
        to_date
        created_at
      }
    }
  }
`;
