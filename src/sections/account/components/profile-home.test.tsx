import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProfileHome } from './profile-home';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockCustomer = {
  firstname: 'Juan',
  lastname: 'Pérez',
  email: 'juan@example.com',
  identificationType: { label: 'Cédula', value: 'CC' },
  identificationNumber: { value: '123456789' },
};

describe('ProfileHome', () => {
  it('renders customer full name', () => {
    renderWithTheme(<ProfileHome customer={mockCustomer as any} />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });

  it('renders customer email', () => {
    renderWithTheme(<ProfileHome customer={mockCustomer as any} />);
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();
  });

  it('renders identification type', () => {
    renderWithTheme(<ProfileHome customer={mockCustomer as any} />);
    expect(screen.getByText('Cédula')).toBeInTheDocument();
  });

  it('renders identification number', () => {
    renderWithTheme(<ProfileHome customer={mockCustomer as any} />);
    expect(screen.getByText('123456789')).toBeInTheDocument();
  });

  it('renders user translation key when no name', () => {
    const customer = { ...mockCustomer, firstname: '', lastname: '', email: '' };
    renderWithTheme(<ProfileHome customer={customer as any} />);
    expect(screen.getByText('customerProfileView.user')).toBeInTheDocument();
  });

  it('uses email as display name when no firstname/lastname', () => {
    const customer = { ...mockCustomer, firstname: '', lastname: '' };
    renderWithTheme(<ProfileHome customer={customer as any} />);
    expect(screen.getAllByText('juan@example.com').length).toBeGreaterThan(0);
  });

  it('shows dash when identificationType is missing', () => {
    const customer = { ...mockCustomer, identificationType: undefined };
    renderWithTheme(<ProfileHome customer={customer as any} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders personal data section header', () => {
    renderWithTheme(<ProfileHome customer={mockCustomer as any} />);
    expect(screen.getByText('customerProfileView.personalData')).toBeInTheDocument();
  });

  it('renders icons', () => {
    renderWithTheme(<ProfileHome customer={mockCustomer as any} />);
    expect(screen.getByTestId('icon-solar:user-rounded-bold')).toBeInTheDocument();
    expect(screen.getByTestId('icon-solar:letter-bold')).toBeInTheDocument();
  });

  it('accepts className prop', () => {
    const { container } = renderWithTheme(
      <ProfileHome customer={mockCustomer as any} className="test-class" />
    );
    expect(container.querySelector('.test-class')).toBeInTheDocument();
  });
});
