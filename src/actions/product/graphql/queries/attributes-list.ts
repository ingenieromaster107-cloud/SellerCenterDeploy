'use client';

import { gql } from 'graphql-request';

/**
 * Query GraphQL para obtener la lista completa de atributos de producto
 * desde Magento (entityType: CATALOG_PRODUCT).
 *
 * Retorna todos los atributos con sus opciones (label, value, is_default)
 * y el tipo de input (frontend_input) para filtrar los configurables (SELECT).
 */
export const ATTRIBUTES_LIST_QUERY = gql`
  query AttributesList {
    attributesList(entityType: CATALOG_PRODUCT, filters: {}) {
      items {
        code
        label
        frontend_input
        options {
          label
          value
          is_default
        }
      }
    }
  }
`;
