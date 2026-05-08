/* c8 ignore file */
/* istanbul ignore file */

// ----------------------------------------------------------------------
// Step 1 — Validación previa del archivo (validateMassUpload)
// ----------------------------------------------------------------------

export interface ValidateMassUploadRequestInterface {
  fileContentBase64: string;
  fileName: string;
  fileType: string;
  attributeSetId: number;
}

export interface ValidateMassUploadResponseInterface {
  validateMassUpload: {
    extension: string;
    file_size_bytes: number;
    message: string;
    success: boolean;
    profile_id?: number | null;
    total_rows?: number | null;
  };
}

// ----------------------------------------------------------------------
// Step 2 — Encolado de la importación
//
// Endpoint REST (multipart/form-data):
//   POST {magentoBase}/rest/V1/import/products
//
// La importación es ASÍNCRONA: el backend responde inmediatamente con un
// `job_id` y `status: "pending"`. Los resultados detallados (resumen, errores
// por fila) se obtendrán posteriormente con un endpoint de consulta de
// status (a definir cuando exista).
// ----------------------------------------------------------------------

/**
 * Modo de importación:
 *  - CREATE: crea productos nuevos. Todas las columnas son obligatorias.
 *  - UPDATE: actualiza productos existentes (mergea). Solo `sku` obligatorio.
 *  - REPLACE: reemplaza completo. Todas las columnas obligatorias.
 */
export type ImportMode = 'CREATE' | 'UPDATE' | 'REPLACE';

export interface QueueMassUploadImportRequestInterface {
  profileId: number;
  importMode: ImportMode;
  csvFile: File;
  /** ZIP de imágenes (opcional). Se envía como `images_zip_file`. */
  imagesZipFile?: File | null;
}

export interface QueueMassUploadImportResponseInterface {
  success: boolean;
  message: string;
  profile_id: number;
  job_id: number;
  status: string;
  import_mode: ImportMode | string;
  /** Path donde el backend persistió el ZIP (informativo). */
  images_zip_path?: string | null;
}
