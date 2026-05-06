import { startMassUploadImportAdapter } from './start-mass-upload-import-adapter';

describe('startMassUploadImportAdapter', () => {
  it('returns empty payload when data is undefined', () => {
    const r = startMassUploadImportAdapter(undefined);
    expect(r.startMassUploadImport.success).toBe(false);
    expect(r.startMassUploadImport.results).toEqual([]);
  });

  it('returns empty payload when key is missing', () => {
    const r = startMassUploadImportAdapter({ errors: [] } as any);
    expect(r.startMassUploadImport.success).toBe(false);
  });

  it('passes through a well-formed response', () => {
    const r = startMassUploadImportAdapter({
      startMassUploadImport: {
        success: true,
        message: 'Done',
        profile_id: 5,
        summary: { total_rows: 2, processed_rows: 2, success_rows: 1, failed_rows: 1 },
        results: [
          {
            row: 1,
            product_id: 100,
            status: 'success',
            message: 'OK',
            errors: [],
            updatedFields: ['name'],
          },
          {
            row: 2,
            product_id: null,
            status: 'failed',
            message: 'stock',
            errors: [{ field: 'stock', message: 'must be >= 0' }],
          },
        ],
      },
    } as any);
    expect(r.startMassUploadImport.success).toBe(true);
    expect(r.startMassUploadImport.summary.failed_rows).toBe(1);
    expect(r.startMassUploadImport.results[1].errors[0]).toEqual({
      field: 'stock',
      message: 'must be >= 0',
    });
    expect(r.startMassUploadImport.results[0].updatedFields).toEqual(['name']);
  });

  it('coerces null/missing fields to safe defaults', () => {
    const r = startMassUploadImportAdapter({
      startMassUploadImport: {
        success: null,
        message: null,
        profile_id: null,
        summary: null,
        results: null,
      },
    } as any);
    expect(r.startMassUploadImport.success).toBe(false);
    expect(r.startMassUploadImport.message).toBe('');
    expect(r.startMassUploadImport.profile_id).toBe(0);
    expect(r.startMassUploadImport.summary).toEqual({
      total_rows: 0,
      processed_rows: 0,
      success_rows: 0,
      failed_rows: 0,
    });
    expect(r.startMassUploadImport.results).toEqual([]);
  });

  it('coerces individual result rows with missing pieces', () => {
    const r = startMassUploadImportAdapter({
      startMassUploadImport: {
        success: false,
        message: 'x',
        profile_id: 1,
        summary: { total_rows: 1, processed_rows: 1, success_rows: 0, failed_rows: 1 },
        results: [{ errors: null, updatedFields: null }],
      },
    } as any);
    expect(r.startMassUploadImport.results[0]).toEqual({
      row: 0,
      product_id: null,
      status: 'failed',
      message: '',
      errors: [],
      updatedFields: [],
    });
  });
});
