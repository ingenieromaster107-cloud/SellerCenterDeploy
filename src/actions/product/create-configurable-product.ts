'use client';

import type {
  CreateConfigurableProductInput,
  CreateConfigurableProductResponse,
} from 'src/interfaces';

import { GraphQLService } from 'src/lib/graphql-client';

import { CREATE_CONFIGURABLE_PRODUCT_MUTATION } from './graphql';

/**
 * Envía el input ya armado a la mutation GraphQL de crear producto configurable.
 * La lógica de armado del payload vive en useConfigurableProductPayload.
 */
export async function createConfigurableProduct(input: CreateConfigurableProductInput) {
  const graphql = GraphQLService.getInstance();

  const result = await graphql.request<
    CreateConfigurableProductResponse,
    { input: CreateConfigurableProductInput }
  >(CREATE_CONFIGURABLE_PRODUCT_MUTATION, { input });

  const data = result?.createConfigurableProduct;

  if (!data) {
    throw new Error('errorMessage');
  }

  if (data.status === 'failed') {
    const rawDetails = data.skuStatus
      ?.filter((s) => !s.created)
      .map((s) => s.message)
      .join(' | ');
    throw new Error(sanitizeConfigurableProductError(rawDetails || data.message));
  }

  return {
    status: data.status,
    skuStatus: data.skuStatus,
    message: data.message,
  };
}

/**
 * Sanitiza mensajes de error del backend.
 * Retorna claves de traducción en vez de textos hardcodeados.
 */
function sanitizeConfigurableProductError(message?: string): string {
  if (!message) return 'errorMessage';

  const lowerMsg = message.toLowerCase();

  // SKU duplicado
  if (lowerMsg.includes('sku existente') || lowerMsg.includes('url ya existe') || lowerMsg.includes('already exists') || lowerMsg.includes('llave url')) {
    return 'skuDuplicateError';
  }

  // Error genérico para cualquier otro caso
  return 'errorMessage';
}
