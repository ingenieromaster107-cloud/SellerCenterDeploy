import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CreateSellersStep2 } from './create-sellers-step-2';

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async () => ({ values: {}, errors: {} }),
}));

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({ value: false, onTrue: jest.fn(), onFalse: jest.fn(), onToggle: jest.fn() }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/actions/attributes/use-attributes', () => ({
  useGetAttributes: () => ({ attributes: null, isLoading: false }),
}));

jest.mock('src/actions/regions/use-regions', () => ({
  useGetRegions: () => ({ regions: [], isLoading: false }),
}));

jest.mock('src/actions/cities/use-cities', () => ({
  useGetCities: () => ({ cities: [], isLoading: false }),
}));

jest.mock('src/shared/constants/graphql-entity-type', () => ({
  EntityType: { Customer: 'customer' },
}));

jest.mock('src/shared/constants/graphql-attribute-code', () => ({
  AttributeCode: { TipoIdentificacionUsuario: 'tipo_id' },
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  Field: {
    Text: ({ name, label }: any) => <input data-testid={`field-${name}`} placeholder={label} />,
    Select: ({ name, label, children }: any) => (
      <select data-testid={`select-${name}`}>{children}</select>
    ),
  },
}));

jest.mock('./styles', () => ({ darkFieldSx: {} }));
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

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const defaultProps = {
  defaultValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    documentType: '',
    documentNumber: '',
    phone: '',
    region: '',
    city: '',
    postcode: '',
    addressShop: '',
    shopUrl: '',
  },
  step: 2,
  total: 3,
  country: 'CO',
  onBack: jest.fn(),
  onNext: jest.fn(),
};

describe('CreateSellersStep2', () => {
  it('renders wizard shell', () => {
    renderWithTheme(<CreateSellersStep2 {...defaultProps} />);
    expect(screen.getByTestId('wizard-shell')).toBeInTheDocument();
  });

  it('renders step indicator', () => {
    renderWithTheme(<CreateSellersStep2 {...defaultProps} />);
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('renders firstName field', () => {
    renderWithTheme(<CreateSellersStep2 {...defaultProps} />);
    expect(screen.getByTestId('field-firstName')).toBeInTheDocument();
  });

  it('renders email field', () => {
    renderWithTheme(<CreateSellersStep2 {...defaultProps} />);
    expect(screen.getByTestId('field-email')).toBeInTheDocument();
  });

  it('renders wizard footer', () => {
    renderWithTheme(<CreateSellersStep2 {...defaultProps} />);
    expect(screen.getByTestId('wizard-footer')).toBeInTheDocument();
  });
});
