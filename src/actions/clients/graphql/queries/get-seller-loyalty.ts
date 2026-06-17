import { gql } from 'graphql-request';

export const GET_SELLER_LOYALTY_QUERY = gql`
  query SellerCustomerLoyalty($fromDate: String!, $toDate: String!) {
    sellerCustomerLoyalty(from_date: $fromDate, to_date: $toDate) {
      success
      message
      data {
        total_customers
        new_customers
        frequent_customers
        loyalty_rate
        customers {
          full_name
          email
          orders_count
          classification
        }
      }
    }
  }
`;
