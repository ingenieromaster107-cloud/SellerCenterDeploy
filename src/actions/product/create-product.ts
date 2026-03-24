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
    throw new Error('Faltan campos obligatorios: nombre, sku o categoría');
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
    throw new Error('Error al crear producto');
  }

  if (!data.success) {
    throw new Error(sanitizeProductError(data.message));
  }

  return { sku: data.sku || sku, success: true };
}

/**
 * Sanitiza mensajes de error del backend para no exponer información sensible.
 * Detecta patrones conocidos y devuelve mensajes amigables.
 */
function sanitizeProductError(message?: string): string {
  if (!message) return 'Ocurrió un error al crear el producto. Intenta nuevamente.';

  const lowerMsg = message.toLowerCase();

  // SKU duplicado
  if (lowerMsg.includes('sku existente') || lowerMsg.includes('url ya existe') || lowerMsg.includes('already exists') || lowerMsg.includes('llave url')) {
    return 'El SKU ingresado ya se encuentra registrado. Por favor utiliza un SKU diferente.';
  }

  // Error genérico para cualquier otro caso
  return 'Ocurrió un error al crear el producto. Intenta nuevamente.';
}
