import { gql } from 'graphql-request';

export const SELLER_MOVEMENTS_EXPORT_CSV_QUERY = gql`
  query SellerMovementsExportCsv($date_from: String!, $date_to: String!) {
    sellerMovementsExportCsv(date_from: $date_from, date_to: $date_to)
  }
`;
