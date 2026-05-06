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
// Step 2 — Importación efectiva (startMassUploadImport)
// ----------------------------------------------------------------------

/**
 * Modo de importación que define cómo se interpretan las filas:
 * - CREATE: crea productos nuevos. Todas las columnas son obligatorias.
 * - UPDATE: actualiza productos existentes (mergea). Solo `sku` es obligatorio.
 * - REPLACE: reemplaza completamente el producto. Todas las columnas obligatorias.
 */
export type ImportMode = 'CREATE' | 'UPDATE' | 'REPLACE';

export interface StartMassUploadImportRequestInterface {
  profileId: number;
  importMode: ImportMode;
}

export interface MassUploadFieldErrorInterface {
  field: string;
  message: string;
}

export interface MassUploadResultRowInterface {
  row: number;
  product_id: number | null;
  status: 'success' | 'failed' | string;
  message: string;
  errors: MassUploadFieldErrorInterface[];
  updatedFields?: string[] | null;
}

export interface MassUploadSummaryInterface {
  total_rows: number;
  processed_rows: number;
  success_rows: number;
  failed_rows: number;
}

export interface StartMassUploadImportResponseInterface {
  startMassUploadImport: {
    success: boolean;
    message: string;
    profile_id: number;
    summary: MassUploadSummaryInterface;
    results: MassUploadResultRowInterface[];
  };
}
