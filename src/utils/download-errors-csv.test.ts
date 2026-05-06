import { buildErrorsCsv, downloadErrorsCsv } from './download-errors-csv';

describe('buildErrorsCsv', () => {
  const baseHeaders = ['sku', 'name'];
  const baseRows = [
    { sku: 'A1', name: 'Producto 1' },
    { sku: 'A2', name: 'Producto 2' },
    { sku: 'A3', name: 'Producto 3' },
  ];

  it('returns empty string when there are no failures', () => {
    const csv = buildErrorsCsv({
      originalHeaders: baseHeaders,
      originalRows: baseRows,
      results: [
        { row: 1, product_id: 1, status: 'success', message: '', errors: [] },
        { row: 2, product_id: 2, status: 'success', message: '', errors: [] },
      ],
    });
    expect(csv).toBe('');
  });

  it('emits a CSV with only failed rows + error columns', () => {
    const csv = buildErrorsCsv({
      originalHeaders: baseHeaders,
      originalRows: baseRows,
      results: [
        { row: 1, product_id: 1, status: 'success', message: 'OK', errors: [] },
        {
          row: 2,
          product_id: null,
          status: 'failed',
          message: 'stock invalid',
          errors: [{ field: 'stock', message: 'must be >= 0' }],
        },
      ],
    });
    const lines = csv.split('\r\n');
    expect(lines[0]).toBe('sku,name,__error_message,__error_fields');
    expect(lines[1]).toContain('A2');
    expect(lines[1]).toContain('stock: must be >= 0');
    expect(lines).toHaveLength(2);
  });

  it('quotes fields that contain commas', () => {
    const csv = buildErrorsCsv({
      originalHeaders: baseHeaders,
      originalRows: [{ sku: 'A1', name: 'Producto, con coma' }],
      results: [
        { row: 1, product_id: null, status: 'failed', message: 'oops', errors: [] },
      ],
    });
    expect(csv).toContain('"Producto, con coma"');
  });

  it('escapes embedded double quotes', () => {
    const csv = buildErrorsCsv({
      originalHeaders: baseHeaders,
      originalRows: [{ sku: 'A1', name: 'Pro "duct"' }],
      results: [
        { row: 1, product_id: null, status: 'failed', message: 'oops', errors: [] },
      ],
    });
    expect(csv).toContain('"Pro ""duct"""');
  });

  it('synthesizes headers from row keys when originalHeaders is empty', () => {
    const csv = buildErrorsCsv({
      originalHeaders: [],
      originalRows: [{ sku: 'A1' }],
      results: [
        { row: 1, product_id: null, status: 'failed', message: 'oops', errors: [] },
      ],
    });
    expect(csv.split('\r\n')[0]).toContain('sku');
  });
});

describe('downloadErrorsCsv', () => {
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;

  beforeEach(() => {
    (URL as any).createObjectURL = jest.fn(() => 'blob:mock');
    (URL as any).revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    (URL as any).createObjectURL = originalCreate;
    (URL as any).revokeObjectURL = originalRevoke;
  });

  it('does nothing when there are no failures', () => {
    downloadErrorsCsv({
      originalHeaders: ['sku'],
      originalRows: [{ sku: 'A' }],
      results: [{ row: 1, product_id: 1, status: 'success', message: '', errors: [] }],
    });
    expect((URL as any).createObjectURL).not.toHaveBeenCalled();
  });

  it('creates and revokes an object URL when there are failures', () => {
    const clickSpy = jest.fn();
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        Object.defineProperty(el, 'click', { value: clickSpy });
      }
      return el;
    });

    downloadErrorsCsv({
      originalHeaders: ['sku'],
      originalRows: [{ sku: 'A' }],
      results: [
        { row: 1, product_id: null, status: 'failed', message: 'bad', errors: [] },
      ],
    });

    expect((URL as any).createObjectURL).toHaveBeenCalled();
    expect((URL as any).revokeObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });
});
