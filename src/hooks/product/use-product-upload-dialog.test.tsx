import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TranslateProvider } from 'src/locales/langs/i18n';

import { useProductUploadDialog } from './use-product-upload-dialog';

const mockValidateCsvFile = jest.fn();
const mockValidateCsvContent = jest.fn();
const mockParseCsv = jest.fn();
const mockValidateMutate = jest.fn();
const mockQueueMutate = jest.fn();
const mockFileToBase64 = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

jest.mock('src/utils/validate-csv', () => ({
  CSV_MAX_BYTES: 1024 * 1024,
  validateCsvFile: (...args: unknown[]) => mockValidateCsvFile(...args),
  validateCsvContent: (...args: unknown[]) => mockValidateCsvContent(...args),
}));

jest.mock('src/utils/parse-csv', () => ({
  parseCsv: (...args: unknown[]) => mockParseCsv(...args),
}));

jest.mock('src/utils/codificateFile', () => ({
  fileToBase64: (...args: unknown[]) => mockFileToBase64(...args),
}));

jest.mock('src/actions/product/use-queue-mass-upload-import', () => ({
  useQueueMassUploadImport: () => ({ mutateAsync: mockQueueMutate }),
}));

jest.mock('src/actions/product/use-validate-mass-upload', () => ({
  useValidateMassUpload: () => ({ mutateAsync: mockValidateMutate }),
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

const makeCsvFile = (content: string, name = 'p.csv') => {
  const file = new File([content], name, { type: 'text/csv' });
  if (typeof (file as any).text !== 'function') {
    (file as any).text = async () => content;
  }
  return file;
};

const makeZipFile = (name = 'imgs.zip') =>
  new File(['zip-bytes'], name, { type: 'application/zip' });

const validParsedCsv = {
  headers: ['sku', 'name'],
  rows: [
    { sku: 'A1', name: 'Producto 1' },
    { sku: 'A2', name: 'Producto 2' },
  ],
  rowErrors: [],
};

const validQueuePayload = {
  success: true,
  message: 'Import queued successfully.',
  profile_id: 9,
  job_id: 1,
  status: 'pending',
  import_mode: 'CREATE',
};

describe('useProductUploadDialog', () => {
  beforeEach(() => {
    [
      mockValidateCsvFile,
      mockValidateCsvContent,
      mockParseCsv,
      mockValidateMutate,
      mockQueueMutate,
      mockFileToBase64,
      mockToastSuccess,
      mockToastError,
    ].forEach((m) => m.mockReset());
  });

  it('starts at step 0 with default mode CREATE', () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }), { wrapper });
    expect(result.current.step).toBe(0);
    expect(result.current.importMode).toBe('CREATE');
    expect(result.current.csvFile).toBeNull();
    expect(result.current.imagesZip).toBeNull();
    expect(result.current.disabledUpload).toBe(true);
  });

  it('handleCsvFiles stores the file and runs basic validation', async () => {
    mockValidateCsvFile.mockResolvedValue([]);
    const file = makeCsvFile('sku,name\nA,B');

    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }), { wrapper });
    await act(async () => {
      await result.current.handleCsvFiles(toFileList([file]));
    });

    expect(result.current.csvFile).toBe(file);
    expect(result.current.csvErrors).toEqual([]);
    expect(mockValidateCsvFile).toHaveBeenCalledWith(
      file,
      expect.objectContaining({ translate: expect.any(Function) })
    );
  });

  it('handleImageFiles stores ZIP files via setImagesZip', () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }), { wrapper });
    const zip = makeZipFile();
    act(() => {
      result.current.handleImageFiles(toFileList([zip]));
    });
    expect(result.current.imagesZip).toBe(zip);
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
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }), { wrapper });

    act(() => result.current.setCsvFile(file));
    await act(async () => {
      await result.current.goToPreview();
    });

    expect(result.current.step).toBe(1);
    expect(result.current.parsedCsv).toEqual(validParsedCsv);
    expect(result.current.hasLocalRowErrors).toBe(false);
  });

  it('confirmAndImport chains validateMassUpload + queueMassUploadImport and lands on step 3', async () => {
    mockFileToBase64.mockResolvedValue('YmFzZTY0');
    mockValidateMutate.mockResolvedValue({
      validateMassUpload: { success: true, message: 'ok', profile_id: 9 },
    });
    mockQueueMutate.mockResolvedValue(validQueuePayload);

    const file = makeCsvFile('sku,name\nA,B');
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }), { wrapper });

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
    expect(mockQueueMutate).toHaveBeenCalledWith({
      profileId: 9,
      importMode: 'CREATE',
      csvFile: file,
      imagesZipFile: null,
    });
    expect(result.current.step).toBe(3);
    expect(result.current.queueResult?.job_id).toBe(1);
    expect(result.current.queueResult?.status).toBe('pending');
  });

  it('confirmAndImport sends the ZIP file directly (multipart) when selected', async () => {
    mockFileToBase64.mockResolvedValue('CSVbase64');
    mockValidateMutate.mockResolvedValue({
      validateMassUpload: { success: true, message: 'ok', profile_id: 9 },
    });
    mockQueueMutate.mockResolvedValue(validQueuePayload);

    const csv = makeCsvFile('sku,name\nA,B');
    const zip = makeZipFile();
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }), { wrapper });

    act(() => {
      result.current.setCsvFile(csv);
      result.current.setImagesZip(zip);
    });

    await act(async () => {
      await result.current.confirmAndImport();
    });

    expect(mockQueueMutate).toHaveBeenCalledWith({
      profileId: 9,
      importMode: 'CREATE',
      csvFile: csv,
      imagesZipFile: zip,
    });
  });

  it('confirmAndImport falls back to step 0 if validateMassUpload fails', async () => {
    mockFileToBase64.mockResolvedValue('YmFzZTY0');
    mockValidateMutate.mockResolvedValue({
      validateMassUpload: { success: false, message: 'Bad CSV', profile_id: null },
    });

    const file = makeCsvFile('sku\nA');
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }), { wrapper });

    act(() => result.current.setCsvFile(file));
    await act(async () => {
      await result.current.confirmAndImport();
    });

    expect(mockToastError).toHaveBeenCalledWith('Bad CSV');
    expect(result.current.step).toBe(0);
    expect(mockQueueMutate).not.toHaveBeenCalled();
  });

  it('confirmAndImport falls back to step 0 on network error', async () => {
    mockFileToBase64.mockResolvedValue('YmFzZTY0');
    mockValidateMutate.mockRejectedValue(new Error('Network down'));

    const file = makeCsvFile('sku\nA');
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }), { wrapper });

    act(() => result.current.setCsvFile(file));
    await act(async () => {
      await result.current.confirmAndImport();
    });

    expect(result.current.step).toBe(0);
    expect(mockToastError).toHaveBeenCalledWith('Network down');
  });

  it('clearAll resets file, ZIP, parsed CSV, errors and step', async () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }), { wrapper });
    act(() => {
      result.current.setCsvFile(makeCsvFile('a'));
      result.current.setImagesZip(makeZipFile());
    });
    act(() => result.current.clearAll());

    expect(result.current.csvFile).toBeNull();
    expect(result.current.imagesZip).toBeNull();
    expect(result.current.parsedCsv).toBeNull();
    expect(result.current.step).toBe(0);
  });

  it('changes import mode', () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }), { wrapper });
    act(() => result.current.setImportMode('UPDATE'));
    expect(result.current.importMode).toBe('UPDATE');
  });
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={qc}>
      <TranslateProvider>{children}</TranslateProvider>
    </QueryClientProvider>
  );
};

