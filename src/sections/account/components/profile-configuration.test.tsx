import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async () => ({ values: {}, errors: {} }),
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/actions/attributes/use-attributes', () => ({
  useGetAttributes: () => ({ attributes: null, isLoading: false, isError: false }),
}));

jest.mock('src/actions/countries/use-countries', () => ({
  useGetCountries: () => ({ countries: [], isLoading: false, isError: false }),
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
  AttributeCode: { TipoIdentificacionUsuario: 'tipo_identificacion_usuario' },
}));

jest.mock('src/components/snackbar', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('src/components/error-content', () => ({
  ErrorContent: ({ title }: any) => <div data-testid="error-content">{title}</div>,
}));

jest.mock('src/components/loading-screen/loading-screen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

jest.mock('src/components', () => ({
  FieldsetLegend: ({ children }: any) => <legend>{children}</legend>,
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children, methods, onSubmit }: any) => <form onSubmit={onSubmit}>{children}</form>,
  Field: {
    Text: ({ name, label }: any) => <input name={name} placeholder={label} aria-label={label} />,
    Autocomplete: ({ name, label }: any) => <input name={name} aria-label={label} />,
    Editor: ({ name }: any) => <textarea name={name} />,
  },
  schemaUtils: {
    email: () => ({ parse: (v: any) => v }),
  },
}));

import { ProfileConfiguration } from './profile-configuration';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const customer: any = {
  id: '1',
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@test.com',
  identificationType: { label: 'CC', value: 'CC' },
  identificationNumber: { value: '123456789' },
  address: {
    telephone: '1234567890',
    country_code: 'CO',
    street: ['Main Street 123'],
    postcode: '110111',
    region: { region_id: '1', region: 'Bogotá' },
    city: 'Bogotá',
  },
};

describe('ProfileConfiguration', () => {
  it('renders personal information section', () => {
    renderWithTheme(<ProfileConfiguration customer={customer} />);
    expect(screen.getByText('formPlaceholder.personalInformation')).toBeInTheDocument();
  });

  it('renders address section', () => {
    renderWithTheme(<ProfileConfiguration customer={customer} />);
    expect(screen.getByText('formPlaceholder.address')).toBeInTheDocument();
  });

  it('renders firstName field', () => {
    renderWithTheme(<ProfileConfiguration customer={customer} />);
    expect(screen.getByLabelText('formPlaceholder.firstName')).toBeInTheDocument();
  });

  it('renders email field', () => {
    renderWithTheme(<ProfileConfiguration customer={customer} />);
    expect(screen.getByLabelText('formPlaceholder.email')).toBeInTheDocument();
  });

  it('renders phone number field', () => {
    renderWithTheme(<ProfileConfiguration customer={customer} />);
    expect(screen.getByLabelText('formPlaceholder.phoneNumber')).toBeInTheDocument();
  });

  it('renders two save buttons', () => {
    renderWithTheme(<ProfileConfiguration customer={customer} />);
    const saveBtns = screen.getAllByText('formPlaceholder.btnSave');
    expect(saveBtns.length).toBe(2);
  });

  it('renders country autocomplete field', () => {
    renderWithTheme(<ProfileConfiguration customer={customer} />);
    expect(screen.getByLabelText('formPlaceholder.country')).toBeInTheDocument();
  });

  it('renders zipCode field', () => {
    renderWithTheme(<ProfileConfiguration customer={customer} />);
    expect(screen.getByLabelText('formPlaceholder.zipCode')).toBeInTheDocument();
  });
});
