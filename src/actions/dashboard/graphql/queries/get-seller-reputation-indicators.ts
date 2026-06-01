import { gql } from 'graphql-request';

export const GET_SELLER_REPUTATION_INDICATORS_QUERY = gql`
  query GetSellerReputationIndicators {
    sellerReputationIndicators {
      success
      message
      data {
        reputation_level
        insufficient_data
        completed_sales

        cancellation_rate
        cancellation_level
        cancellation_suggestion

        claims_rate
        claims_level
        claims_suggestion

        on_time_dispatch_rate
        on_time_dispatch_level
        on_time_dispatch_suggestion

        avg_response_time
        avg_response_time_level
        avg_response_time_suggestion

        period_from
        period_to
        calculated_at
      }
    }
  }
`;
