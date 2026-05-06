import { act, renderHook } from '@testing-library/react';

import { useProductUploadDialog } from './use-product-upload-dialog';

const mockValidateCsvFile = jest.fn();
const mockValidateCsvContent = jest.fn();
const mockParseCsv = jest.fn();
const mockValidateMutate = jest.fn();
const mockImportMutate = jest.fn();
const mockFileToBase64 = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
const mockDownload = jest.fn();

jest.mock('src/utils/validate-csv', () => ({
  CSV_MAX_BYTES: 1024 * 1024,
  validateCsvFile: (...args: unknown[]) => mockValidateCsvFile(...args),
  validateCsvContent: (...args: unknown[]) => mockValidateCsvContent(...args),
}));

jest.mock('src/utils/parse-csv', () => ({
  parseCsv: (...args: unknown[]) => mockParseCsv(...args),
}));

jest.mock('src/actions/product/useValidateMassUpload', () => ({
  useValidateMassUpload: () => ({ mutateAsync: mockValidateMutate }),
}));

jest.mock('src/actions/product/useStartMassUploadImport', () => ({
  useStartMassUploadImport: () => ({ mutateAsync: mockImportMutate }),
}));

jest.mock('src/utils/codificateFile', () => ({
  fileToBase64: (...args: unknown[]) => mockFileToBase64(...args),
}));

jest.mock('src/utils/download-errors-csv', () => ({
  downloadErrorsCsv: (...args: unknown[]) => mockDownload(...args),
}));

jest.mock('src/components/snackbar', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

const toFileList = (files: File[]): FileList => {
  const obj: Record<number, File> = {};
  files.forEach((f, i) => {
    obj[i] = f;
  });
  return Object.assign(obj, {
    length: files.length,
    item: (index: number) => files[index] ?? null,
    [Symbol.iterator]: () => files[Symbol.iterator](),
  }) as unknown as FileList;
};

// jsdom no incluye File#text() en todas las versiones; polyfill mínimo.
const makeCsvFile = (content: string, name = 'p.csv') => {
  const file = new File([content], name, { type: 'text/csv' });
  if (typeof (file as any).text !== 'function') {
    (file as any).text = async () => content;
  }
  return file;
};

const validParsedCsv = {
  headers: ['sku', 'name'],
  rows: [
    { sku: 'A1', name: 'Producto 1' },
    { sku: 'A2', name: 'Producto 2' },
  ],
  rowErrors: [],
};

describe('useProductUploadDialog', () => {
  beforeEach(() => {
    [
      mockValidateCsvFile,
      mockValidateCsvContent,
      mockParseCsv,
      mockValidateMutate,
      mockImportMutate,
      mockFileToBase64,
      mockToastSuccess,
      mockToastError,
      mockDownload,
    ].forEach((m) => m.mockReset());
  });

  it('starts at step 0 with default mode CREATE', () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));
    expect(result.current.step).toBe(0);
    expect(result.current.importMode).toBe('CREATE');
    expect(result.current.csvFile).toBeNull();
    expect(result.current.disabledUpload).toBe(true);
  });

  it('handleCsvFiles stores the file and runs validation', async () => {
    mockValidateCsvFile.mockResolvedValue([]);
    const file = makeCsvFile('sku,name\nA,B');

    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));
    await act(async () => {
      await result.current.handleCsvFiles(toFileList([file]));
    });

    expect(result.current.csvFile).toBe(file);
    expect(result.current.csvErrors).toEqual([]);
    expect(mockValidateCsvFile).toHaveBeenCalledWith(file);
  });

  it('goToPreview parses CSV, validates, and advances to step 1 when clean', async () => {
    mockValidateCsvFile.mockResolvedValue([]);
    mockParseCsv.mockReturnValue(validParsedCsv);
    mockValidateCsvContent.mockReturnValue({
      errors: [],
      parsed: validParsedCsv,
      rowErrorIndexes: new Set(),
      rowErrorMap: new Map(),
    });

    const file = makeCsvFile('sku,name\nA,B');
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));

    act(() => result.current.setCsvFile(file));
    await act(async () => {
      await result.current.goToPreview();
    });

    expect(result.current.step).toBe(1);
    expect(result.current.parsedCsv).toEqual(validParsedCsv);
    expect(result.current.hasLocalRowErrors).toBe(false);
  });

  it('goToPreview stays on step 0 when file-level errors exist', async () => {
    mockValidateCsvFile.mockResolvedValue(['Faltan columnas obligatorias: sku.']);
    mockParseCsv.mockReturnValue(validParsedCsv);

    const file = makeCsvFile('name\nB');
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));

    act(() => result.current.setCsvFile(file));
    await act(async () => {
      await result.current.goToPreview();
    });

    expect(result.current.step).toBe(0);
    expect(result.current.csvErrors.length).toBeGreaterThan(0);
  });

  it('confirmAndImport chains validateMassUpload + startMassUploadImport and lands on step 3', async () => {
    mockFileToBase64.mockResolvedValue('YmFzZTY0');
    mockValidateMutate.mockResolvedValue({
      validateMassUpload: { success: true, message: 'ok', profile_id: 128 },
    });
    mockImportMutate.mockResolvedValue({
      startMassUploadImport: {
        success: true,
        message: 'Done',
        profile_id: 128,
        summary: { total_rows: 2, processed_rows: 2, success_rows: 2, failed_rows: 0 },
        results: [],
      },
    });

    const file = makeCsvFile('sku,name\nA,B');
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));

    act(() => result.current.setCsvFile(file));
    await act(async () => {
      await result.current.confirmAndImport();
    });

    expect(mockValidateMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        attributeSetId: 10,
        fileContentBase64: 'YmFzZTY0',
        fileName: 'p',
        fileType: 'csv',
      })
    );
    expect(mockImportMutate).toHaveBeenCalledWith({ profileId: 128, importMode: 'CREATE' });
    expect(result.current.step).toBe(3);
    expect(result.current.importResult?.success).toBe(true);
  });

  it('confirmAndImport falls back to step 0 if validateMassUpload fails', async () => {
    mockFileToBase64.mockResolvedValue('YmFzZTY0');
    mockValidateMutate.mockResolvedValue({
      validateMassUpload: { success: false, message: 'Bad CSV', profile_id: null },
    });

    const file = makeCsvFile('sku\nA');
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));

    act(() => result.current.setCsvFile(file));
    await act(async () => {
      await result.current.confirmAndImport();
    });

    expect(mockToastError).toHaveBeenCalledWith('Bad CSV');
    expect(result.current.step).toBe(0);
    expect(mockImportMutate).not.toHaveBeenCalled();
  });

  it('confirmAndImport falls back to step 0 on network error', async () => {
    mockFileToBase64.mockResolvedValue('YmFzZTY0');
    mockValidateMutate.mockRejectedValue(new Error('Network down'));

    const file = makeCsvFile('sku\nA');
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));

    act(() => result.current.setCsvFile(file));
    await act(async () => {
      await result.current.confirmAndImport();
    });

    expect(result.current.step).toBe(0);
    expect(mockToastError).toHaveBeenCalledWith('Network down');
  });

  it('retryFailed triggers download and toasts a hint', async () => {
    mockValidateCsvFile.mockResolvedValue([]);
    mockParseCsv.mockReturnValue(validParsedCsv);
    mockValidateCsvContent.mockReturnValue({
      errors: [],
      parsed: validParsedCsv,
      rowErrorIndexes: new Set(),
      rowErrorMap: new Map(),
    });
    mockFileToBase64.mockResolvedValue('YmFzZTY0');
    mockValidateMutate.mockResolvedValue({
      validateMassUpload: { success: true, message: 'ok', profile_id: 1 },
    });
    mockImportMutate.mockResolvedValue({
      startMassUploadImport: {
        success: false,
        message: 'partial',
        profile_id: 1,
        summary: { total_rows: 2, processed_rows: 2, success_rows: 1, failed_rows: 1 },
        results: [
          { row: 1, product_id: 1, status: 'success', message: 'OK', errors: [] },
          { row: 2, product_id: null, status: 'failed', message: 'oops', errors: [] },
        ],
      },
    });

    const file = makeCsvFile('sku,name\nA,B\nC,D');
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));

    act(() => result.current.setCsvFile(file));
    // Step 0 -> 1 to populate parsedCsv
    await act(async () => {
      await result.current.goToPreview();
    });
    // Step 1 -> 3 (chains the two mutations)
    await act(async () => {
      await result.current.confirmAndImport();
    });

    act(() => {
      result.current.retryFailed();
    });

    expect(mockDownload).toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalled();
    expect(result.current.failedResults).toHaveLength(1);
  });

  it('handleUpload routes to goToPreview at step 0 and confirmAndImport at step 1', async () => {
    mockValidateCsvFile.mockResolvedValue([]);
    mockParseCsv.mockReturnValue(validParsedCsv);
    mockValidateCsvContent.mockReturnValue({
      errors: [],
      parsed: validParsedCsv,
      rowErrorIndexes: new Set(),
      rowErrorMap: new Map(),
    });
    mockFileToBase64.mockResolvedValue('YmFzZTY0');
    mockValidateMutate.mockResolvedValue({
      validateMassUpload: { success: true, message: 'ok', profile_id: 9 },
    });
    mockImportMutate.mockResolvedValue({
      startMassUploadImport: {
        success: true,
        message: 'Done',
        profile_id: 9,
        summary: { total_rows: 2, processed_rows: 2, success_rows: 2, failed_rows: 0 },
        results: [],
      },
    });

    const file = makeCsvFile('sku,name\nA,B');
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));
    act(() => result.current.setCsvFile(file));

    // step 0 -> 1
    await act(async () => {
      await result.current.handleUpload();
    });
    expect(result.current.step).toBe(1);

    // step 1 -> 3 (passes through 2)
    await act(async () => {
      await result.current.handleUpload();
    });
    expect(result.current.step).toBe(3);
  });

  it('clearAll resets file, parsed CSV, errors and step', async () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));
    act(() => result.current.setCsvFile(new File(['a'], 'a.csv', { type: 'text/csv' })));
    act(() => result.current.clearAll());

    expect(result.current.csvFile).toBeNull();
    expect(result.current.parsedCsv).toBeNull();
    expect(result.current.step).toBe(0);
  });

  it('changes import mode', () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));
    act(() => result.current.setImportMode('UPDATE'));
    expect(result.current.importMode).toBe('UPDATE');
  });
});
