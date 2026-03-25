'use client';

import type {
  CreateProductPayload,
  CreateSimpleProductResponse,
  CreateSimpleProductVariables,
} from 'src/interfaces';

import { GraphQLService } from 'src/lib/graphql-client';

import { CREATE_SIMPLE_PRODUCT_MUTATION } from './graphql';

/** Llama a la mutation GraphQL para crear un producto simple. */
export async function createProduct(payload: CreateProductPayload) {
  const {
    name,
    categoryId,
    sku,
    price,
    weight,
    shortDescription,
    description,
    stock,
    images = [],
    files = [],
  } = payload;

  if (!name || !sku || !categoryId) {
    throw new Error('missingFieldsError');
  }

  // Construye mediaGallery: cada imagen se envía como base64 al backend
  const mediaGallery = files.map((file, index) => {
    const label = file?.name?.replace(/\.[^/.]+$/, '') ?? `${sku}-${index}`;
    return {
      media_type: 'image',
      label,
      position: index,
      disabled: false,
      types: index === 0 ? ['image', 'small_image', 'thumbnail'] : ['image'],
      content: {
        base64_encoded_data: images[index] ?? '',
        type: file?.type ?? 'image/png',
        name: file?.name ?? `${label}.png`,
      },
    };
  });

  const variables: CreateSimpleProductVariables = {
    name,
    categoryId: String(categoryId),
    sku: String(sku),
    price: Number.parseFloat(String(price)) || 0,
    weight: Number.parseFloat(String(weight)) || 0,
    shortDescription: shortDescription ?? '',
    description: description ?? '',
    stock: Number(stock) || 0,
    mediaGallery,
  };

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

  return { sku: data.sku || sku, success: true };
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
