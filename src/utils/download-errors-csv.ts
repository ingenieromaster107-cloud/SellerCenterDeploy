import type { MassUploadResultRowInterface } from 'src/interfaces/load/bulk-loading.interface';

// ----------------------------------------------------------------------
// Genera y descarga un CSV con SOLO las filas que fallaron en la importación,
// preservando los datos originales del CSV subido y agregando dos columnas
// extra al final (`__error_message`, `__error_fields`) con el motivo del
// fallo. El usuario corrige y reintenta subiendo este mismo archivo.
// ----------------------------------------------------------------------

const escapeCsvCell = (value: unknown): string => {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const ERROR_COLUMNS = ['__error_message', '__error_fields'] as const;

export interface BuildErrorsCsvParams {
  /** Headers tal cual se subieron originalmente. */
  originalHeaders: string[];
  /** Filas originales (objetos con la misma forma que `originalHeaders`). */
  originalRows: Array<Record<string, string>>;
  /** Resultados que vinieron del backend. */
  results: MassUploadResultRowInterface[];
}

/**
 * Construye un string CSV con las filas fallidas + columnas de error.
 * Si `originalHeaders` viene vacío, sintetiza headers a partir de las claves.
 */
export const buildErrorsCsv = ({
  originalHeaders,
  originalRows,
  results,
}: BuildErrorsCsvParams): string => {
  const failed = results.filter((r) => r.status !== 'success');
  if (failed.length === 0) return '';

  const headers = originalHeaders.length > 0 ? originalHeaders : Object.keys(originalRows[0] ?? {});
  const fullHeaders = [...headers, ...ERROR_COLUMNS];

  const lines: string[] = [fullHeaders.map(escapeCsvCell).join(',')];

  failed.forEach((result) => {
    const idx = result.row - 1;
    const original = originalRows[idx] ?? {};
    const cells = headers.map((h) => escapeCsvCell(original[h] ?? ''));
    cells.push(escapeCsvCell(result.message));
    cells.push(
      escapeCsvCell(
        result.errors.map((e) => `${e.field}: ${e.message}`).join(' | ')
      )
    );
    lines.push(cells.join(','));
  });

  return lines.join('\r\n');
};

/**
 * Dispara la descarga en el navegador. No-op fuera del browser (SSR / tests
 * que no mockean Blob/URL).
 */
export const downloadErrorsCsv = (
  params: BuildErrorsCsvParams,
  filename = 'errores-carga-masiva.csv'
): void => {
  const csv = buildErrorsCsv(params);
  if (!csv) return;
  if (typeof window === 'undefined' || typeof URL.createObjectURL !== 'function') return;

  // BOM (U+FEFF) para que Excel detecte UTF-8 al abrir el archivo.
  const BOM = '\uFEFF';
  const blob = new Blob([`${BOM}${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
