import { gql } from 'graphql-request';

export const GET_SELLER_KPI_METRICS_QUERY = gql`
  query SellerKpiMetrics(
    $fromDate: String
    $toDate: String
    $compareFromDate: String
    $compareToDate: String
  ) {
    sellerKpiMetrics(
      from_date: $fromDate
      to_date: $toDate
      compare_from_date: $compareFromDate
      compare_to_date: $compareToDate
    ) {
      success
      message
      data {
        period_from
        period_to
        compare_from
        compare_to
        has_comparison
        gross_sales {
          current
          previous
          variation_pct
          is_new
        }
        units_sold {
          current
          previous
          variation_pct
          is_new
        }
        average_price {
          current
          previous
          variation_pct
          is_new
        }
        visits {
          current
          previous
          variation_pct
          is_new
        }
        conversion {
          current
          previous
          variation_pct
          is_new
        }
        cancellation_rate {
          current
          previous
          variation_pct
          is_new
        }
      }
    }
  }
`;
