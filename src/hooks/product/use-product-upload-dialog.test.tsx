import { act, renderHook } from '@testing-library/react';

import { useProductUploadDialog } from './use-product-upload-dialog';

const mockValidateCsvFile = jest.fn();
const mockMutateAsync = jest.fn();
const mockFileToBase64 = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

jest.mock('src/utils/validate-csv', () => ({
  validateCsvFile: (...args: unknown[]) => mockValidateCsvFile(...args),
  validateCsvContent: jest.fn().mockReturnValue([]),
  CSV_MAX_BYTES: 5242880,
}));

jest.mock('src/actions/product/use-validate-mass-upload', () => ({
  useValidateMassUpload: () => ({ mutateAsync: mockMutateAsync }),
}));

jest.mock('src/utils/codificateFile', () => ({
  fileToBase64: (...args: unknown[]) => mockFileToBase64(...args),
}));

jest.mock('src/components/snackbar', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/actions/product/use-queue-mass-upload-import', () => ({
  useQueueMassUploadImport: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('src/utils/parse-csv', () => ({
  parseCsv: jest.fn().mockReturnValue([]),
  CSV_MAX_BYTES: 5242880,
}));

// JSDOM doesn't implement File.prototype.text()
if (!File.prototype.text) {
  File.prototype.text = function () {
    return Promise.resolve('');
  };
}

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

describe('useProductUploadDialog', () => {
  beforeEach(() => {
    mockValidateCsvFile.mockReset();
    mockValidateCsvFile.mockResolvedValue([]);
    mockMutateAsync.mockReset();
    mockFileToBase64.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with expected defaults', () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));
    expect(result.current.csvFile).toBeNull();
    expect(result.current.images).toEqual([]);
    expect(result.current.imagesZip).toBeNull();
    expect(result.current.disabledUpload).toBe(true);
  });

  it('returns handler functions', () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));
    expect(typeof result.current.handleCsvFiles).toBe('function');
    expect(typeof result.current.handleUpload).toBe('function');
    expect(typeof result.current.setCsvFile).toBe('function');
  });

  it('setCsvFile updates csvFile state', () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));
    const csvFile = new File(['a,b'], 'products.csv', { type: 'text/csv' });
    act(() => {
      result.current.setCsvFile(csvFile);
    });
    expect(result.current.csvFile).toEqual(csvFile);
  });

  it('setCsvFile to null resets csvFile', () => {
    const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));
    act(() => { result.current.setCsvFile(null); });
    expect(result.current.csvFile).toBeNull();
  });
});
