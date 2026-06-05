'use client';

import { gql } from 'graphql-request';

export const VALIDATE_SELLER_COUPON_QUERY = gql`
  query ValidateSellerCoupon($cart_id: String!, $coupon_code: String!) {
    validateSellerCoupon(cart_id: $cart_id, coupon_code: $coupon_code) {
      is_valid
      discount_preview
      message
      promotion {
        entity_id
        name
        discount_type
        discount_amount
      }
    }
  }
`;
