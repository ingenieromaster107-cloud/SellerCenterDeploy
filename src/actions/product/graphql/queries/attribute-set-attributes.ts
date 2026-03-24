'use client';

import { gql } from 'graphql-request';

/**
 * Query GraphQL para obtener los atributos de un attribute set específico
 * desde el módulo custom AttributeSetGraphQl de Magento.
 *
 * Retorna attribute_id y attribute_code para poder mapear los
 * atributos configurables con su ID numérico real.
 */
export const ATTRIBUTE_SET_ATTRIBUTES_QUERY = gql`
  query AttributeSetAttributes($attributeSetId: Int!, $isUserDefined: Boolean) {
    attributeSetAttributes(attribute_set_id: $attributeSetId, is_user_defined: $isUserDefined) {
      items {
        attribute_id
        attribute_code
        frontend_label
        is_required
        is_user_defined
      }
    }
  }
`;
