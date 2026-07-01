import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProductUploadDialog } from './product-upload-dialog';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (...args: string[]) => args.at(-1) ?? '',
  }),
}));

jest.mock('src/hooks/product/use-product-upload-dialog', () => ({
  useProductUploadDialog: () => ({
    step: 0,
    csvInputRef: { current: null },
    imgInputRef: { current: null },
    csvFile: null,
    imagesZip: null,
    importMode: 'CREATE',
    setImportMode: jest.fn(),
    parsedCsv: null,
    rowErrorMap: {},
    hasLocalRowErrors: false,
    uploading: false,
    queueResult: null,
    result: null,
    showCancelDialog: false,
    csvInvalid: false,
    zipInvalid: false,
    csvErrors: [],
    onPickCsv: jest.fn(),
    onPickImages: jest.fn(),
    handleCsvFiles: jest.fn(),
    handleImageFiles: jest.fn(),
    onDropCsv: jest.fn(),
    onDropImages: jest.fn(),
    setCsvFile: jest.fn(),
    setImagesZip: jest.fn(),
    disabledUpload: false,
    goToPreview: jest.fn(),
    goBackToUpload: jest.fn(),
    confirmAndImport: jest.fn(),
    clearAll: jest.fn(),
    handleCancelUpload: jest.fn(),
    handleCancelBulkUpload: jest.fn(),
    setShowCancelDialog: jest.fn(),
  }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-icon={icon} />,
}));

jest.mock('src/components/custom-dialog', () => ({
  ConfirmDialog: () => null,
}));

jest.mock('./csv-errors-alert', () => ({
  CsvErrorsAlert: () => <div data-testid="csv-errors-alert" />,
}));

jest.mock('./csv-preview-table', () => ({
  CsvPreviewTable: () => <div data-testid="csv-preview-table" />,
}));

jest.mock('./import-mode-selector', () => ({
  ImportModeSelector: () => <div data-testid="import-mode-selector" />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProductUploadDialog', () => {
  it('renders dialog title when open', () => {
    renderWithTheme(<ProductUploadDialog open onClose={jest.fn()} />);
    expect(screen.getByText('productLoad.dialog.title')).toBeInTheDocument();
  });

  it('renders stepper with step labels', () => {
    renderWithTheme(<ProductUploadDialog open onClose={jest.fn()} />);
    expect(screen.getByText('productLoad.steps.upload')).toBeInTheDocument();
    expect(screen.getByText('productLoad.steps.preview')).toBeInTheDocument();
  });

  it('does not render dialog content when closed', () => {
    renderWithTheme(<ProductUploadDialog open={false} onClose={jest.fn()} />);
    expect(screen.queryByText('title')).not.toBeInTheDocument();
  });

  it('renders import mode selector on step 0', () => {
    renderWithTheme(<ProductUploadDialog open onClose={jest.fn()} />);
    expect(screen.getByTestId('import-mode-selector')).toBeInTheDocument();
  });
});
