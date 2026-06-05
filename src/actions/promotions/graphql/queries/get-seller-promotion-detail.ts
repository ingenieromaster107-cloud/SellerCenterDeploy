'use client';

import { gql } from 'graphql-request';

export const GET_SELLER_PROMOTION_DETAIL_QUERY = gql`
  query GetSellerPromotionDetail($promotion_id: Int!) {
    sellerPromotion(promotion_id: $promotion_id) {
      promotion {
        entity_id
        name
        description
        discount_type
        apply_type
        discount_amount
        coupon_code
        from_date
        to_date
        max_budget
        budget_spent
        usage_limit
        uses_per_customer
        times_used
        min_purchase_amount
        applies_to_all_products
        status
        product_ids
        category_ids
        created_at
        updated_at
      }
      stats {
        times_used
        total_discount_granted
        total_revenue_generated
      }
    }
  }
`;
