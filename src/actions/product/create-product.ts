'use client';

import type {
  CreateSimpleProductResponse,
  CreateSimpleProductVariables,
} from 'src/interfaces';

import { GraphQLService } from 'src/lib/graphql-client';

import { CREATE_SIMPLE_PRODUCT_MUTATION } from './graphql';

/**
 * Envía las variables ya armadas a la mutation GraphQL de crear producto simple.
 * La lógica de armado del payload vive en useSimpleProductPayload.
 */
export async function createProduct(variables: CreateSimpleProductVariables) {
  const graphql = GraphQLService.getInstance();

  const result = await graphql.request<CreateSimpleProductResponse, CreateSimpleProductVariables>(
    CREATE_SIMPLE_PRODUCT_MUTATION,
    variables
  );

  const data = result?.createSimpleProduct;

  if (!data) {
    throw new Error('errorMessage');
  }

  if (!data.success) {
    throw new Error(sanitizeProductError(data.message));
  }

  return { sku: data.sku || variables.sku, success: true };
}

/**
 * Sanitiza mensajes de error del backend.
 * Retorna claves de traducción en vez de textos hardcodeados.
 */
function sanitizeProductError(message?: string): string {
  if (!message) return 'errorMessage';

  const lowerMsg = message.toLowerCase();

  // SKU duplicado
  if (lowerMsg.includes('sku existente') || lowerMsg.includes('url ya existe') || lowerMsg.includes('already exists') || lowerMsg.includes('llave url')) {
    return 'skuDuplicateError';
  }

  // Error genérico para cualquier otro caso
  return 'errorMessage';
}
