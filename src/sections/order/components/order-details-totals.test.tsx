import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderDetailsTotals } from './order-details-totals';

jest.mock('src/utils/format-number', () => ({
  fCurrency: (v: number | null) => `$${v ?? 0}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const prices = {
  subtotal_excl_tax: { value: 100000 },
  subtotal_incl_tax: { value: 119000 },
  total_tax: { value: 19000 },
  total_shipping: { value: 8000 },
  grand_total: { value: 127000 },
  total_store_credit: { value: 0 },
};

describe('OrderDetailsTotals', () => {
  it('renders header', () => {
    renderWithTheme(
      <OrderDetailsTotals
        items={[]}
        productsPrice={100000}
        shipping={8000}
        commission={5000}
        profit={95000}
        totalInclTax={119000}
        totalCreditStore={0}
        prices={prices as any}
      />
    );
    expect(screen.getByText('Información el pedido')).toBeInTheDocument();
  });

  it('renders Total productos label', () => {
    renderWithTheme(
      <OrderDetailsTotals
        items={[]}
        productsPrice={100000}
        shipping={8000}
        commission={5000}
        profit={95000}
        totalInclTax={119000}
        totalCreditStore={0}
        prices={prices as any}
      />
    );
    expect(screen.getByText('Total productos')).toBeInTheDocument();
  });

  it('renders formatted products price', () => {
    renderWithTheme(
      <OrderDetailsTotals
        items={[]}
        productsPrice={100000}
        shipping={8000}
        commission={5000}
        profit={95000}
        totalInclTax={119000}
        totalCreditStore={0}
        prices={prices as any}
      />
    );
    expect(screen.getByText('$100000')).toBeInTheDocument();
  });

  it('renders shipping label', () => {
    renderWithTheme(
      <OrderDetailsTotals
        items={[]}
        productsPrice={100000}
        shipping={8000}
        commission={5000}
        profit={95000}
        totalInclTax={119000}
        totalCreditStore={0}
        prices={prices as any}
      />
    );
    expect(screen.getByText('Manejo y envío')).toBeInTheDocument();
  });

  it('shows dash when shipping is 0', () => {
    renderWithTheme(
      <OrderDetailsTotals
        items={[]}
        productsPrice={100000}
        shipping={0}
        commission={5000}
        profit={95000}
        totalInclTax={119000}
        totalCreditStore={0}
        prices={prices as any}
      />
    );
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders grand total label', () => {
    renderWithTheme(
      <OrderDetailsTotals
        items={[]}
        productsPrice={100000}
        shipping={8000}
        commission={5000}
        profit={95000}
        totalInclTax={119000}
        totalCreditStore={0}
        prices={prices as any}
      />
    );
    expect(screen.getByText('Monto total del vendedor')).toBeInTheDocument();
  });
});
