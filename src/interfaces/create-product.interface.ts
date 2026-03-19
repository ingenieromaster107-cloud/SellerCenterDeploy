// ----------------------------------------------------------------------
// Interfaces para la creación de productos simples
// ----------------------------------------------------------------------

/** Entrada de la galería de medios para enviar imágenes en base64 al backend Magento */
export interface MediaGalleryEntryInput {
  media_type: string;
  label: string;
  position: number;
  disabled: boolean;
  types: string[];
  content: {
    base64_encoded_data: string;
    type: string;
    name: string;
  };
}

/** Variables que recibe la mutation GraphQL de crear producto simple */
export interface CreateSimpleProductVariables {
  name: string;
  categoryId: string;
  sku: string;
  price: number;
  weight: number;
  shortDescription: string;
  description: string;
  stock: number;
  mediaGallery: MediaGalleryEntryInput[];
}

/** Respuesta de la mutation createSimpleProduct */
export interface CreateSimpleProductResponse {
  createSimpleProduct: {
    sku: string;
    success: boolean;
    message: string;
  };
}

/** Payload del formulario de creación (antes de transformar) */
export interface CreateProductFormValues {
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  weight: number;
  shortDescription: string;
  description: string;
  stock: number;
}

/** Payload completo que recibe la action createProduct */
export interface CreateProductPayload extends CreateProductFormValues {
  images: string[];
  files: File[];
}
