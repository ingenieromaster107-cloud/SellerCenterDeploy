import {
  CSV_MAX_BYTES,
  validateCsvFile,
  validateCsvContent,
  getRequiredHeaders,
  EXPECTED_HEADERS,
} from './validate-csv';
import { parseCsv } from './parse-csv';

const createFile = (size: number, type = 'text/csv', name = 'test.csv') => {
  const content = 'a'.repeat(size);
  return new File([content], name, { type });
};

describe('validateCsvFile (back-compat: file-only)', () => {
  it('resolves with empty array for file within size limit', async () => {
    const errors = await validateCsvFile(createFile(100));
    expect(errors).toEqual([]);
  });

  it('resolves with error when file exceeds size limit', async () => {
    const errors = await validateCsvFile(createFile(CSV_MAX_BYTES + 1));
    expect(errors.some((e) => /demasiado grande/i.test(e))).toBe(true);
  });

  it('rejects files with non-CSV type and non-csv extension', async () => {
    const errors = await validateCsvFile(
      createFile(100, 'image/png', 'something.png')
    );
    expect(errors.some((e) => /CSV/i.test(e))).toBe(true);
  });

  it('accepts a .csv file even if MIME is text/plain', async () => {
    const errors = await validateCsvFile(createFile(100, 'text/plain', 'a.csv'));
    expect(errors).toEqual([]);
  });
});

describe('getRequiredHeaders', () => {
  it('returns ALL expected headers for CREATE', () => {
    expect(getRequiredHeaders('CREATE')).toEqual([...EXPECTED_HEADERS]);
  });

  it('returns ALL expected headers for REPLACE', () => {
    expect(getRequiredHeaders('REPLACE')).toEqual([...EXPECTED_HEADERS]);
  });

  it('returns only [sku] for UPDATE', () => {
    expect(getRequiredHeaders('UPDATE')).toEqual(['sku']);
  });
});

describe('validateCsvContent', () => {
  const HEADER_LINE = EXPECTED_HEADERS.join(',');

  it('flags rows with empty required cells in CREATE mode', () => {
    const csv = `${HEADER_LINE}\nSKU-1,${',,'.repeat(20)},Seller_01\n`;
    const parsed = parseCsv(csv);
    const result = validateCsvContent(parsed, 'CREATE');
    expect(result.rowErrorMap.size).toBeGreaterThan(0);
    expect(result.rowErrorMap.get(0)?.some((m) => /columna obligatoria/i.test(m))).toBe(true);
  });

  it('does NOT flag rows in UPDATE mode if sku is present', () => {
    const csv = `${HEADER_LINE}\nSKU-1${','.repeat(EXPECTED_HEADERS.length - 1)}\n`;
    const parsed = parseCsv(csv);
    const result = validateCsvContent(parsed, 'UPDATE');
    expect(result.rowErrorMap.size).toBe(0);
  });

  it('flags rows in UPDATE mode if sku is empty', () => {
    const csv = `${HEADER_LINE}\n${','.repeat(EXPECTED_HEADERS.length - 1)}\n`;
    const parsed = parseCsv(csv);
    const result = validateCsvContent(parsed, 'UPDATE');
    expect(result.rowErrorMap.get(0)?.some((m) => /sku/.test(m))).toBe(true);
  });

  it('propagates parse-level row errors (column mismatch)', () => {
    const parsed = {
      headers: ['a', 'b', 'c'],
      rows: [{ a: '1', b: '2', c: '' }],
      rowErrors: [{ row: 1, message: 'la fila 1 tiene 2 columnas y se esperaban 3.' }],
    };
    const result = validateCsvContent(parsed, 'UPDATE');
    expect(result.rowErrorMap.get(0)?.some((m) => /tiene 2 columnas/.test(m))).toBe(true);
  });
});
