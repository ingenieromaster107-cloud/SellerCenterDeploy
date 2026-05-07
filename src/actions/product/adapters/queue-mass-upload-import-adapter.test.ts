import { queueMassUploadImportAdapter } from './queue-mass-upload-import-adapter';

describe('queueMassUploadImportAdapter', () => {
  it('returns empty payload when data is undefined', () => {
    const r = queueMassUploadImportAdapter(undefined);
    expect(r.queueMassUploadImport.success).toBe(false);
    expect(r.queueMassUploadImport.job_id).toBe(0);
  });

  it('returns empty payload when key is missing', () => {
    const r = queueMassUploadImportAdapter({ errors: [] } as any);
    expect(r.queueMassUploadImport.success).toBe(false);
  });

  it('passes through a well-formed response', () => {
    const r = queueMassUploadImportAdapter({
      queueMassUploadImport: {
        success: true,
        message: 'Import queued successfully.',
        profile_id: 157,
        job_id: 1,
        status: 'pending',
        import_mode: 'UPDATE',
      },
    } as any);
    expect(r.queueMassUploadImport).toMatchObject({
      success: true,
      message: 'Import queued successfully.',
      profile_id: 157,
      job_id: 1,
      status: 'pending',
      import_mode: 'UPDATE',
    });
  });

  it('coerces null fields to safe defaults', () => {
    const r = queueMassUploadImportAdapter({
      queueMassUploadImport: {
        success: null,
        message: null,
        profile_id: null,
        job_id: null,
        status: null,
        import_mode: null,
      },
    } as any);
    expect(r.queueMassUploadImport).toEqual({
      success: false,
      message: '',
      profile_id: 0,
      job_id: 0,
      status: 'unknown',
      import_mode: '',
    });
  });
});
