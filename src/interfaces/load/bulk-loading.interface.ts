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
// Step 2 — Encolado de la importación (queueMassUploadImport)
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
  /**
   * ZIP de imágenes en base64 (sin prefijo `data:`). El backend lo decodifica
   * y persiste antes de procesar la cola. Si no hay imágenes, enviar `null`.
   * El parámetro de la mutation se llama `images_zip_path` por convención
   * histórica del schema, pero su valor es la cadena base64.
   */
  imagesZipPath?: string | null;
}

export interface QueueMassUploadImportResponseInterface {
  queueMassUploadImport: {
    success: boolean;
    message: string;
    profile_id: number;
    job_id: number;
    status: string;
    import_mode: ImportMode | string;
  };
}
