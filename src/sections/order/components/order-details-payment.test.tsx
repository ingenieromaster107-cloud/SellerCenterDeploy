import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderDetailsPayment } from './order-details-payment';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('OrderDetailsPayment', () => {
  it('renders payment header', () => {
    renderWithTheme(<OrderDetailsPayment payment={{}} />);
    expect(screen.getByText('Pago')).toBeInTheDocument();
  });

  it('renders card number when provided', () => {
    renderWithTheme(<OrderDetailsPayment payment={{ cardNumber: '**** 4242' }} />);
    expect(screen.getByText('**** 4242')).toBeInTheDocument();
  });

  it('renders mastercard icon', () => {
    renderWithTheme(<OrderDetailsPayment payment={{}} />);
    expect(screen.getByTestId('icon-payments:mastercard')).toBeInTheDocument();
  });

  it('renders without crashing when no cardNumber', () => {
    renderWithTheme(<OrderDetailsPayment payment={{}} />);
    expect(document.body).toBeInTheDocument();
  });
});
