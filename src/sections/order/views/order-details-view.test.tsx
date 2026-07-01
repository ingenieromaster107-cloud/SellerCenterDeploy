import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderDetailsView } from './order-details-view';

jest.mock('src/routes/paths', () => ({
  paths: {
    order: { root: '/orders', details: (id: string) => `/orders/${id}` },
    product: { details: (sku: string) => `/products/${sku}` },
  },
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('../components/order-details-toolbar', () => ({
  OrderDetailsToolbar: ({ orderNumber, status }: any) => (
    <div data-testid="toolbar">
      <span>{orderNumber}</span>
      <span>{status}</span>
    </div>
  ),
}));

jest.mock('../components/order-details-items', () => ({
  OrderDetailsItems: () => <div data-testid="details-items" />,
}));

jest.mock('../components/order-details-totals', () => ({
  OrderDetailsTotals: () => <div data-testid="details-totals" />,
}));

jest.mock('../components/order-details-toolbar', () => ({
  OrderDetailsToolbar: ({ orderNumber }: any) => (
    <div data-testid="toolbar">{orderNumber}</div>
  ),
}));

jest.mock('../components/order-details-shipping', () => ({
  OrderDetailsShipping: () => <div data-testid="details-shipping" />,
}));

jest.mock('../components/order-details-information', () => ({
  OrderDetailsInformation: () => <div data-testid="details-information" />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockOrder: any = {
  orderNumber: 'ORD-9999',
  status: 'Entregado',
  createDate: '2024-01-15T10:00:00Z',
  shipping_method: 'flatrate:flatrate-Standard',
  paymentMethodSelected: 'PSE',
  tracking: [],
  customer: {
    name: 'Juan Pérez',
    email: 'juan@test.com',
    shippingAddress: {
      street: ['Calle 1'],
      city: 'Bogotá',
      region: 'Cundinamarca',
      postcode: '110111',
    },
  },
  billing_address: {
    street: ['Av. 2'],
    city: 'Bogotá',
    region: 'Cundinamarca',
    postcode: '110000',
  },
  items: [],
  prices: {
    subtotal_excl_tax: { value: 100000 },
    subtotal_incl_tax: { value: 119000 },
    total_tax: { value: 19000 },
    total_shipping: { value: 8000 },
    grand_total: { value: 127000 },
    total_store_credit: { value: 0 },
  },
};

describe('OrderDetailsView', () => {
  it('renders home content wrapper', () => {
    renderWithTheme(<OrderDetailsView order={mockOrder} />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders toolbar with order number', () => {
    renderWithTheme(<OrderDetailsView order={mockOrder} />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByText('ORD-9999')).toBeInTheDocument();
  });

  it('renders order information section', () => {
    renderWithTheme(<OrderDetailsView order={mockOrder} />);
    expect(screen.getByTestId('details-information')).toBeInTheDocument();
  });

  it('renders order totals section', () => {
    renderWithTheme(<OrderDetailsView order={mockOrder} />);
    expect(screen.getByTestId('details-totals')).toBeInTheDocument();
  });

  it('renders order shipping section', () => {
    renderWithTheme(<OrderDetailsView order={mockOrder} />);
    expect(screen.getByTestId('details-shipping')).toBeInTheDocument();
  });

  it('renders order items section', () => {
    renderWithTheme(<OrderDetailsView order={mockOrder} />);
    expect(screen.getByTestId('details-items')).toBeInTheDocument();
  });
});
