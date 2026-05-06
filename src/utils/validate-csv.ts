import type { ImportMode } from 'src/interfaces/load/bulk-loading.interface';

import { parseCsv, type ParsedCsv } from './parse-csv';

// ----------------------------------------------------------------------
// Validación local del archivo CSV antes de enviarlo al backend.
//
// Política según `import_mode`:
//  - CREATE / REPLACE: todas las columnas son obligatorias (header presente
//    y celda no vacía en cada fila).
//  - UPDATE: solo `sku` es obligatorio (las demás se mergean).
//
// Si la lista de headers requeridos cambia en el backend, ajustar
// `EXPECTED_HEADERS` y la lógica de `getRequiredHeaders`.
// ----------------------------------------------------------------------

export const EXPECTED_HEADERS = [
  'sku',
  'special_price',
  'product_type',
  'name',
  'description',
  'attribute_mapping_category',
  'special_from_date',
  'special_to_date',
  'is_in_stock',
  'stock',
  'weight',
  'images',
  'meta_title',
  'meta_keyword',
  'meta_description',
  'color',
  'manufacturer',
  'tier_price',
  'related_skus',
  'crosssell_skus',
  'upsell_skus',
  'seller_id',
] as const;

export type ExpectedHeader = (typeof EXPECTED_HEADERS)[number];

// 1 MB — límite del backend por base64/encoding.
export const CSV_MAX_BYTES = 1024 * 1024;

const ALLOWED_TYPES = new Set([
  'text/csv',
  'application/vnd.ms-excel',
  'application/csv',
  'text/plain',
]);

const isCsvByName = (name: string) => /\.csv$/i.test(name);

export const getRequiredHeaders = (mode: ImportMode): ExpectedHeader[] => {
  if (mode === 'UPDATE') return ['sku'];
  return [...EXPECTED_HEADERS];
};

export interface CsvValidationOptions {
  mode: ImportMode;
  /** Si se pasa, se reusa el parseo en vez de re-leer el archivo. */
  parsed?: ParsedCsv;
}

export interface CsvValidationResult {
  errors: string[];
  parsed: ParsedCsv | null;
  /** Índices de filas (0-based, sin contar header) con al menos un error local. */
  rowErrorIndexes: Set<number>;
  /** Errores agrupados por índice de fila para marcado en preview. */
  rowErrorMap: Map<number, string[]>;
}

const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo'));
    reader.readAsText(file, 'utf-8');
  });

/**
 * Valida un archivo CSV en cliente y retorna errores agregados + por fila.
 *
 * Mantiene compatibilidad con la firma antigua: si solo se pasa el `File`
 * (sin opciones), valida únicamente tamaño y tipo, replicando la conducta
 * previa del flujo (back-compat para callers que aún no conocen `mode`).
 */
export async function validateCsvFile(
  file: File,
  options?: Partial<CsvValidationOptions>
): Promise<string[]> {
  if (!file) return ['Debe seleccionar un archivo CSV.'];

  const errors: string[] = [];

  if (!ALLOWED_TYPES.has(file.type) && !isCsvByName(file.name)) {
    errors.push('El archivo debe tener formato CSV.');
  }
  if (file.size > CSV_MAX_BYTES) {
    errors.push('El archivo CSV es demasiado grande. El tamaño máximo permitido es de 1 MB.');
  }

  // Back-compat: si no nos pasaron `mode`, no validamos contenido.
  if (!options?.mode) return errors;

  // Si hubo errores de tamaño/tipo, no tiene sentido seguir.
  if (errors.length > 0) return errors;

  const parsed = options.parsed ?? parseCsv(await readFileAsText(file));

  if (parsed.headers.length === 0) {
    return ['El archivo CSV está vacío.'];
  }

  const required = getRequiredHeaders(options.mode);
  const missing = required.filter((h) => !parsed.headers.includes(h));
  if (missing.length > 0) {
    errors.push(`Faltan columnas obligatorias: ${missing.join(', ')}.`);
  }

  if (parsed.rows.length === 0) {
    errors.push('El archivo CSV no contiene filas de datos.');
  }

  return errors;
}

/**
 * Valida fila por fila: detecta celdas vacías en columnas requeridas según el
 * modo y propaga errores de parseo. Devuelve estructura útil para marcar la
 * tabla de preview.
 */
export const validateCsvContent = (
  parsed: ParsedCsv,
  mode: ImportMode
): CsvValidationResult => {
  const required = getRequiredHeaders(mode);
  const rowErrorMap = new Map<number, string[]>();

  // Errores globales de parseo (col mismatch).
  parsed.rowErrors.forEach(({ row, message }) => {
    const idx = row - 1;
    const list = rowErrorMap.get(idx) ?? [];
    list.push(message);
    rowErrorMap.set(idx, list);
  });

  parsed.rows.forEach((rowObj, idx) => {
    const messages: string[] = [];
    required.forEach((h) => {
      const value = rowObj[h];
      if (value === undefined || value === null || String(value).trim() === '') {
        messages.push(`Falta valor en columna obligatoria: ${h}`);
      }
    });
    if (messages.length > 0) {
      const existing = rowErrorMap.get(idx) ?? [];
      rowErrorMap.set(idx, [...existing, ...messages]);
    }
  });

  return {
    errors: [],
    parsed,
    rowErrorIndexes: new Set(rowErrorMap.keys()),
    rowErrorMap,
  };
};
