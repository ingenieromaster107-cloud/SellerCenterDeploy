import { gql } from 'graphql-request';

export const SELLER_MOVEMENTS_SUMMARY_QUERY = gql`
  query SellerMovementsSummary($date_from: String!, $date_to: String!) {
    sellerMovementsSummary(date_from: $date_from, date_to: $date_to) {
      seller_id
      date_from
      date_to
      gross_sales
      total_commissions
      total_refunds
      net_seller
      movements_count
    }
  }
`;
