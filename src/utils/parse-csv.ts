// ----------------------------------------------------------------------
// Parser CSV mínimo orientado al flujo de carga masiva de productos.
// Maneja:
//  - Comillas dobles para campos con comas/saltos de línea internos.
//  - "" como escape de comilla literal.
//  - CRLF y LF.
// No es un parser RFC-4180 completo — el flujo aquí no requiere tipos
// avanzados, pero soporta los CSV que produce Excel/Sheets/Magento.
// ----------------------------------------------------------------------

export interface ParsedCsv {
  /** Headers exactamente como aparecen (sin trim agresivo más allá de \r\n). */
  headers: string[];
  /** Filas como objetos {header: value}. */
  rows: Array<Record<string, string>>;
  /** Errores de parseo a nivel fila — por ejemplo cantidad de columnas distinta a headers. */
  rowErrors: Array<{ row: number; message: string }>;
}

const splitCsvLine = (line: string): string[] => {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
};

/**
 * Divide el texto en líneas respetando saltos dentro de comillas.
 * Devuelve líneas sin el `\r` final.
 */
const splitIntoLogicalLines = (text: string): string[] => {
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') {
      // Manejar `""` como literal dentro de comillas (no toggle).
      if (inQuotes && text[i + 1] === '"') {
        current += '""';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      current += ch;
      continue;
    }
    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      lines.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.length > 0) lines.push(current);
  return lines;
};

export const parseCsv = (text: string): ParsedCsv => {
  const trimmed = text.replace(/^\uFEFF/, ''); // BOM (U+FEFF)
  const logicalLines = splitIntoLogicalLines(trimmed).filter((l) => l.length > 0);

  if (logicalLines.length === 0) {
    return { headers: [], rows: [], rowErrors: [] };
  }

  const headers = splitCsvLine(logicalLines[0]).map((h) => h.trim());
  const rows: Array<Record<string, string>> = [];
  const rowErrors: ParsedCsv['rowErrors'] = [];

  for (let i = 1; i < logicalLines.length; i += 1) {
    const cells = splitCsvLine(logicalLines[i]);
    if (cells.length !== headers.length) {
      rowErrors.push({
        row: i,
        message: `La fila ${i} tiene ${cells.length} columnas y se esperaban ${headers.length}.`,
      });
    }
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = (cells[idx] ?? '').trim();
    });
    rows.push(obj);
  }

  return { headers, rows, rowErrors };
};
