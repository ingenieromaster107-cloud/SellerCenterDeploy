'use client';

import { gql } from 'graphql-request';

export const GET_SELLER_PROMOTIONS_QUERY = gql`
  query GetSellerPromotions(
    $pageSize: Int
    $currentPage: Int
    $filter: SellerPromotionFilterInput
  ) {
    sellerPromotions(pageSize: $pageSize, currentPage: $currentPage, filter: $filter) {
      items {
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
      total_count
      page_size
      current_page
    }
  }
`;
