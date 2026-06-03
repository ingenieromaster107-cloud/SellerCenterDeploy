import { gql } from 'graphql-request';

export const SELLER_MOVEMENTS_QUERY = gql`
  query SellerMovements(
    $date_from: String!
    $date_to: String!
    $pageSize: Int
    $currentPage: Int
    $categories: [SellerMovementCategory!]
  ) {
    sellerMovements(
      date_from: $date_from
      date_to: $date_to
      pageSize: $pageSize
      currentPage: $currentPage
      sort_direction: DESC
      categories: $categories
    ) {
      total_count
      page_info {
        page_size
        current_page
        total_pages
      }
      items {
        movement_id
        order_id
        order_increment_id
        order_item_id
        seller_id
        category
        amount
        commission_value
        net_value
        product_name
        quantity
        guide_number
        order_status
        created_at
      }
    }
  }
`;
