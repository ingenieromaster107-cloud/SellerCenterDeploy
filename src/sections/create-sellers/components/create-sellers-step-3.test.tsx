import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { getDocRequirements } from './document-rules';
import { CreateSellersStep3 } from './create-sellers-step-3';

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async () => ({ values: {}, errors: {} }),
}));

jest.mock('src/utils/codificateFile', () => ({
  fileToBase64: jest.fn(),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
}));

jest.mock('./wizard-shell', () => ({
  WizardShell: ({ children }: any) => <div data-testid="wizard-shell">{children}</div>,
}));
jest.mock('./wizard-footer', () => ({
  WizardFooter: () => <div data-testid="wizard-footer" />,
}));
jest.mock('./step-indicator', () => ({
  StepIndicator: ({ current, total }: any) => (
    <div data-testid="step-indicator">{`${current}/${total}`}</div>
  ),
}));
jest.mock('./file-upload-field', () => ({
  FileUploadField: ({ label }: any) => <div data-testid="file-upload-field">{label}</div>,
}));
jest.mock('./document-rules', () => ({
  ACCEPTED_MIME: 'application/pdf',
  ALL_DOC_CODES: ['rut', 'cedula', 'passport'],
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  getDocRequirements: jest.fn(() => ({
    required: ['rut'],
    oneOf: [],
  })),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const defaultProps = {
  defaultValues: { rut: null, cedula: null, passport: null },
  step: 3,
  total: 3,
  country: 'CO',
  personType: 'natural_person',
  onBack: jest.fn(),
  onNext: jest.fn(),
};

describe('CreateSellersStep3', () => {
  it('renders wizard shell', () => {
    renderWithTheme(<CreateSellersStep3 {...defaultProps} />);
    expect(screen.getByTestId('wizard-shell')).toBeInTheDocument();
  });

  it('renders step indicator', () => {
    renderWithTheme(<CreateSellersStep3 {...defaultProps} />);
    expect(screen.getByText('3/3')).toBeInTheDocument();
  });

  it('renders wizard footer', () => {
    renderWithTheme(<CreateSellersStep3 {...defaultProps} />);
    expect(screen.getByTestId('wizard-footer')).toBeInTheDocument();
  });

  it('renders file upload fields for required docs', () => {
    renderWithTheme(<CreateSellersStep3 {...defaultProps} />);
    expect(screen.getByTestId('file-upload-field')).toBeInTheDocument();
  });

  it('renders nothing when no doc requirements', () => {
    jest.mocked(getDocRequirements).mockReturnValueOnce(null);
    renderWithTheme(<CreateSellersStep3 {...defaultProps} country="XX" />);
    expect(screen.getByTestId('wizard-shell')).toBeInTheDocument();
  });
});
