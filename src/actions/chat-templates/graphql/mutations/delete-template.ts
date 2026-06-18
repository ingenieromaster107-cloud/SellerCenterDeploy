import { gql } from 'graphql-request';

export const DELETE_TEMPLATE = gql`
  mutation InterSellersDeleteResponseTemplate($entity_id: Int!) {
    interSellersDeleteResponseTemplate(input: { entity_id: $entity_id }) {
      message
      success
    }
  }
`;
