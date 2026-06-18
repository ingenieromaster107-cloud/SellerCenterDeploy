import { gql } from 'graphql-request';

export const CREATE_TEMPLATE = gql`
  mutation InterSellersCreateResponseTemplate($content: String!, $is_active: Int!, $title: String!) {
    interSellersCreateResponseTemplate(
      input: {
        content: $content
        is_active: $is_active
        title: $title
      }
    ) {
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
`;
