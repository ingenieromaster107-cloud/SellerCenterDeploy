import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderDetailsShipping } from './order-details-shipping';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const shippingAddress = {
  street: ['Calle 1'],
  city: 'Bogotá',
  region: 'Cundinamarca',
  postcode: '110111',
  firstname: 'Carlos',
  lastname: 'Ruiz',
  prefix: '',
  suffix: '',
  telephone: '3001234567',
};

describe('OrderDetailsShipping', () => {
  it('renders section header', () => {
    renderWithTheme(
      <OrderDetailsShipping
        isOwnOrder
        shippingAddress={shippingAddress}
        clientName="Carlos Ruiz"
        clientEmail="carlos@example.com"
      />
    );
    expect(screen.getByText('Información de la compra')).toBeInTheDocument();
  });

  it('renders client name', () => {
    renderWithTheme(
      <OrderDetailsShipping
        isOwnOrder
        shippingAddress={shippingAddress}
        clientName="María López"
        clientEmail="maria@example.com"
      />
    );
    expect(screen.getByText('María López')).toBeInTheDocument();
  });

  it('renders client email', () => {
    renderWithTheme(
      <OrderDetailsShipping
        isOwnOrder
        shippingAddress={shippingAddress}
        clientName="Pedro"
        clientEmail="pedro@tienda.com"
      />
    );
    expect(screen.getByText('pedro@tienda.com')).toBeInTheDocument();
  });

  it('renders label for client name', () => {
    renderWithTheme(
      <OrderDetailsShipping
        isOwnOrder
        shippingAddress={shippingAddress}
        clientName="Juan"
        clientEmail="juan@test.com"
      />
    );
    expect(screen.getByText('Nombre cliente')).toBeInTheDocument();
  });
});
