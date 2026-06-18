import { gql } from 'graphql-request';

export const GET_TEMPLATES_LIST = gql`
  query InterSellersMyResponseTemplates {
    interSellersMyResponseTemplates {
      total_count
      items {
        content
        created_at
        entity_id
        is_active
        seller_id
        sort_order
        title
        updated_at
      }
    }
  }
`;
