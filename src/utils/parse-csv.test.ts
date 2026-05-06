import { parseCsv } from './parse-csv';

describe('parseCsv', () => {
  it('parses simple CSV', () => {
    const result = parseCsv('a,b\n1,2\n3,4');
    expect(result.headers).toEqual(['a', 'b']);
    expect(result.rows).toEqual([
      { a: '1', b: '2' },
      { a: '3', b: '4' },
    ]);
    expect(result.rowErrors).toHaveLength(0);
  });

  it('handles quoted fields with commas', () => {
    const result = parseCsv('a,b\n"hello, world","x"');
    expect(result.rows[0]).toEqual({ a: 'hello, world', b: 'x' });
  });

  it('handles escaped quotes inside quoted fields', () => {
    const result = parseCsv('a\n"he said ""hi"""');
    expect(result.rows[0]).toEqual({ a: 'he said "hi"' });
  });

  it('handles CRLF line endings', () => {
    const result = parseCsv('a,b\r\n1,2\r\n3,4');
    expect(result.rows).toHaveLength(2);
  });

  it('strips a leading BOM', () => {
    const result = parseCsv('﻿a,b\n1,2');
    expect(result.headers).toEqual(['a', 'b']);
  });

  it('reports row errors when column count mismatches', () => {
    const result = parseCsv('a,b,c\n1,2');
    expect(result.rowErrors).toHaveLength(1);
    expect(result.rowErrors[0].row).toBe(1);
  });

  it('returns empty when text is empty', () => {
    const result = parseCsv('');
    expect(result.headers).toEqual([]);
    expect(result.rows).toEqual([]);
  });

  it('handles newlines inside quoted fields', () => {
    const result = parseCsv('a,b\n"line1\nline2",2');
    expect(result.rows[0].a).toBe('line1\nline2');
  });
});
