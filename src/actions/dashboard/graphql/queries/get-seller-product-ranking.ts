import { gql } from 'graphql-request';

export const GET_SELLER_PRODUCT_RANKING_QUERY = gql`
  query SellerProductRanking($fromDate: String!, $toDate: String!) {
    sellerProductRanking(from_date: $fromDate, to_date: $toDate) {
      success
      message
      total_count
      data {
        product_id
        sku
        product_name
        gross_sales
        units_sold
        visits
        participation
      }
    }
  }
`;
