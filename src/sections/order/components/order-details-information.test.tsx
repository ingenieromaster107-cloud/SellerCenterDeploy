import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderDetailsInformation } from './order-details-information';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const shippingAddress = {
  street: ['Calle 123', 'Apto 4'],
  city: 'Bogotá',
  region: 'Cundinamarca',
  postcode: '110111',
  firstname: 'Carlos',
  lastname: 'Ruiz',
  prefix: '',
  suffix: '',
  telephone: '3001234567',
};

const billingAddress = {
  street: ['Av. El Dorado', 'Piso 2'],
  city: 'Bogotá',
  region: 'Cundinamarca',
  postcode: '110011',
  firstname: 'Carlos',
  lastname: 'Ruiz',
  prefix: '',
  suffix: '',
  telephone: '3001234567',
};

describe('OrderDetailsInformation', () => {
  it('renders card title', () => {
    renderWithTheme(
      <OrderDetailsInformation
        isOwnOrder
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
        shippingMethod="flatrate:flatrate-Envío estándar"
        paymentMethod="Transferencia bancaria"
      />
    );
    expect(screen.getByText('Información de la orden')).toBeInTheDocument();
  });

  it('renders shipping section label', () => {
    renderWithTheme(
      <OrderDetailsInformation
        isOwnOrder
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
        shippingMethod="flatrate:flatrate-Envío estándar"
        paymentMethod="Efecty"
      />
    );
    expect(screen.getByText('Datos de envío')).toBeInTheDocument();
  });

  it('renders shipping city and region', () => {
    renderWithTheme(
      <OrderDetailsInformation
        isOwnOrder
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
        shippingMethod="flatrate:flatrate-Envío"
        paymentMethod="PSE"
      />
    );
    const matches = screen.getAllByText(/Bogotá/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('renders billing section label', () => {
    renderWithTheme(
      <OrderDetailsInformation
        isOwnOrder
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
        shippingMethod="free:free-Gratis"
        paymentMethod="Nequi"
      />
    );
    expect(screen.getByText('Dirección de facturación')).toBeInTheDocument();
  });

  it('renders payment method', () => {
    renderWithTheme(
      <OrderDetailsInformation
        isOwnOrder
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
        shippingMethod="free:free"
        paymentMethod="PSE"
      />
    );
    expect(screen.getByText('PSE')).toBeInTheDocument();
  });

  it('shows fallback when payment is No Payment Information Required', () => {
    renderWithTheme(
      <OrderDetailsInformation
        isOwnOrder
        shippingAddress={shippingAddress}
        shippingMethod="free:free"
        paymentMethod="No Payment Information Required"
      />
    );
    expect(
      screen.getByText('No se ha especificado el método de pago')
    ).toBeInTheDocument();
  });
});
