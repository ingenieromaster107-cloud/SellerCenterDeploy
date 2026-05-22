import { parseCsv } from './parse-csv';
import {
  CSV_MAX_BYTES,
  validateCsvFile,
  EXPECTED_HEADERS,
  validateCsvContent,
  getRequiredHeaders,
} from './validate-csv';

const createFile = (size: number, type = 'text/csv', name = 'test.csv') => {
  const content = 'a'.repeat(size);
  return new File([content], name, { type });
};

const translate = (_namespaceOrKey: string, keyOrDefault?: string) => {
  const messages: Record<string, string> = {
    'errors.fileRequired': 'Debes seleccionar un archivo CSV.',
    'errors.invalidType': 'El archivo debe tener formato CSV.',
    'errors.tooBig': 'El archivo CSV es demasiado grande. El tamaño máximo permitido es de 1 MB.',
    'errors.readError': 'No se pudo leer el archivo CSV.',
    'errors.empty': 'El archivo CSV está vacío.',
    'errors.missingRequiredColumns': 'Faltan columnas obligatorias.',
    'errors.noRows': 'El archivo CSV no contiene filas de datos.',
    'errors.missingSku': 'Falta valor en columna obligatoria: sku',
  };

  return messages[keyOrDefault ?? ''] ?? keyOrDefault ?? '';
};

describe('validateCsvFile (back-compat: file-only)', () => {
  it('resolves with empty array for file within size limit', async () => {
    const errors = await validateCsvFile(createFile(100), { translate });
    expect(errors).toEqual([]);
  });

  it('resolves with error when file exceeds size limit', async () => {
    const errors = await validateCsvFile(createFile(CSV_MAX_BYTES + 1), { translate });
    expect(errors.some((e) => /demasiado grande/i.test(e))).toBe(true);
  });

  it('rejects files with non-CSV type and non-csv extension', async () => {
    const errors = await validateCsvFile(createFile(100, 'image/png', 'something.png'), {
      translate,
    });
    expect(errors.some((e) => /CSV/i.test(e))).toBe(true);
  });

  it('accepts a .csv file even if MIME is text/plain', async () => {
    const errors = await validateCsvFile(createFile(100, 'text/plain', 'a.csv'), { translate });
    expect(errors).toEqual([]);
  });
});

describe('getRequiredHeaders', () => {
  it.each(['CREATE', 'UPDATE', 'REPLACE'] as const)(
    'returns only [sku] regardless of mode (mode = %s)',
    (mode) => {
      expect(getRequiredHeaders(mode)).toEqual(['sku']);
    }
  );

  it('keeps EXPECTED_HEADERS as documentation reference (sku is included)', () => {
    expect(EXPECTED_HEADERS).toContain('sku');
  });
});

describe('validateCsvContent', () => {
  const HEADER_LINE = ['sku', 'name', 'stock', 'tier_price', 'crosssell_skus'].join(',');

  it('does NOT flag rows with empty optional cells (CREATE)', () => {
    // Row con sku presente y otras columnas vacías → válido a nivel front.
    const csv = `${HEADER_LINE}\nSKU-1,Producto 1,10,,\n`;
    const parsed = parseCsv(csv);
    const result = validateCsvContent(parsed, 'CREATE', { translate });
    expect(result.rowErrorMap.size).toBe(0);
  });

  it('does NOT flag rows with empty optional cells (REPLACE)', () => {
    const csv = `${HEADER_LINE}\nSKU-1,Producto 1,10,,\n`;
    const parsed = parseCsv(csv);
    const result = validateCsvContent(parsed, 'REPLACE', { translate });
    expect(result.rowErrorMap.size).toBe(0);
  });

  it('flags rows with empty sku regardless of mode', () => {
    const csv = `${HEADER_LINE}\n,Producto sin sku,10,,\n`;
    const parsed = parseCsv(csv);
    const result = validateCsvContent(parsed, 'CREATE', { translate });
    expect(result.rowErrorMap.get(0)?.some((m) => /sku/.test(m))).toBe(true);
  });

  it('flags rows with empty sku in UPDATE mode', () => {
    const csv = `${HEADER_LINE}\n,Producto sin sku,10,,\n`;
    const parsed = parseCsv(csv);
    const result = validateCsvContent(parsed, 'UPDATE', { translate });
    expect(result.rowErrorMap.get(0)?.some((m) => /sku/.test(m))).toBe(true);
  });

  it('propagates parse-level row errors (column mismatch)', () => {
    const parsed = {
      headers: ['a', 'b', 'c'],
      rows: [{ a: '1', b: '2', c: '' }],
      rowErrors: [{ row: 1, message: 'la fila 1 tiene 2 columnas y se esperaban 3.' }],
    };
    const result = validateCsvContent(parsed, 'UPDATE', { translate });
    expect(result.rowErrorMap.get(0)?.some((m) => /tiene 2 columnas/.test(m))).toBe(true);
  });
});
