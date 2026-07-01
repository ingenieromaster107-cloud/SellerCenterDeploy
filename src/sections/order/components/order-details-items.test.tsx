import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderDetailsItems } from './order-details-items';

jest.mock('src/routes/paths', () => ({
  paths: {
    product: { details: (sku: string) => `/products/${sku}` },
  },
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/utils/format-number', () => ({
  fCurrency: (v: number) => `$${v}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const prices: any = {
  subtotal_excl_tax: { value: 100000 },
  subtotal_incl_tax: { value: 119000 },
  total_tax: { value: 19000 },
  total_shipping: { value: 8000 },
  grand_total: { value: 127000 },
  total_store_credit: { value: 0 },
};

const items: any[] = [
  {
    sku: 'SKU-001',
    name: 'Camiseta Azul',
    quantity: 2,
    priceProvider: 50000,
    coverUrl: '/img/camiseta.jpg',
    selected_options: [],
  },
  {
    sku: 'SKU-002',
    name: 'Pantalón Negro',
    quantity: 1,
    priceProvider: 80000,
    coverUrl: '',
    selected_options: [{ label: 'Talla', value: 'M' }],
  },
];

describe('OrderDetailsItems', () => {
  it('renders card header', () => {
    renderWithTheme(
      <OrderDetailsItems
        items={items}
        productsPrice={130000}
        shipping={8000}
        commission={5000}
        profit={125000}
        totalInclTax={154700}
        totalCreditStore={0}
        prices={prices}
      />
    );
    expect(screen.getByText('Detalles de los productos')).toBeInTheDocument();
  });

  it('renders item names', () => {
    renderWithTheme(
      <OrderDetailsItems
        items={items}
        productsPrice={130000}
        shipping={8000}
        commission={5000}
        profit={125000}
        totalInclTax={154700}
        totalCreditStore={0}
        prices={prices}
      />
    );
    expect(screen.getByText('Camiseta Azul')).toBeInTheDocument();
    expect(screen.getByText('Pantalón Negro')).toBeInTheDocument();
  });

  it('renders quantities', () => {
    renderWithTheme(
      <OrderDetailsItems
        items={items}
        productsPrice={130000}
        shipping={8000}
        commission={5000}
        profit={125000}
        totalInclTax={154700}
        totalCreditStore={0}
        prices={prices}
      />
    );
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
  });

  it('renders formatted prices', () => {
    renderWithTheme(
      <OrderDetailsItems
        items={items}
        productsPrice={130000}
        shipping={8000}
        commission={5000}
        profit={125000}
        totalInclTax={154700}
        totalCreditStore={0}
        prices={prices}
      />
    );
    expect(screen.getByText('$50000')).toBeInTheDocument();
    expect(screen.getByText('$80000')).toBeInTheDocument();
  });

  it('renders empty items without crashing', () => {
    renderWithTheme(
      <OrderDetailsItems
        items={[]}
        productsPrice={0}
        shipping={0}
        commission={0}
        profit={0}
        totalInclTax={0}
        totalCreditStore={0}
        prices={prices}
      />
    );
    expect(screen.getByText('Detalles de los productos')).toBeInTheDocument();
  });
});
