import { gql } from 'graphql-request';

export const UPDATE_TEMPLATES_LIST = gql`
  mutation InterSellersUpdateResponseTemplate(
    $entity_id: Int!
    $is_active: Int!
    $title: String!
    $content: String!
  ) {
    interSellersUpdateResponseTemplate(
      input: { entity_id: $entity_id, is_active: $is_active, title: $title, content: $content }
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
