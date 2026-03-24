'use client';

import { gql } from 'graphql-request';

/**
 * Mutation GraphQL para crear un producto configurable en Magento.
 *
 * Envía en una sola llamada tanto el producto padre (configurable)
 * como todos los productos hijos (simples/variaciones).
 *
 * La estructura de input sigue la API real de Magento:
 * - simpleProducts: array de productos hijos con sus atributos de variación
 * - configurableProduct: el producto padre con las opciones configurables
 */
export const CREATE_CONFIGURABLE_PRODUCT_MUTATION = gql`
  mutation CreateConfigurableProduct($input: CreateConfigurableProductInput!) {
    createConfigurableProduct(input: $input) {
      status
      skuStatus {
        sku
        created
        message
      }
      message
    }
  }
`;
