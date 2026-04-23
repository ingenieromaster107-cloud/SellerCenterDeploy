import { gql } from 'graphql-request';

export const GET_ATTRIBUTES = gql`
  query ($attributeCode: String!, $entityType: String!) {
    customAttributeMetadataV2(
      attributes: [{ attribute_code: $attributeCode, entity_type: $entityType }]
    ) {
      items {
        code
        label
        options {
          value
          label
        }
      }
    }
  }
`;
