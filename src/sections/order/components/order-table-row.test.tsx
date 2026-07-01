import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderTableRow } from './order-table-row';

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({
    value: false,
    onTrue: jest.fn(),
    onFalse: jest.fn(),
    onToggle: jest.fn(),
  }),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    product: { details: (sku: string) => `/product/${sku}` },
  },
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

jest.mock('src/utils/format-number', () => ({
  fCurrency: (v: number) => `$${v}`,
}));

jest.mock('src/utils/format-time', () => ({
  fDate: (v: string) => `date:${v}`,
  fTime: (v: string) => `time:${v}`,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span data-testid="order-status-label">{children}</span>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('../resources/constants', () => ({
  STATUS_WITHOUT_GUIDES: ['Pago por confirmar', 'Cancelado'],
}));

const mockRow = {
  orderNumber: 'ORD-001',
  customer: { name: 'Juan Pérez', email: 'juan@example.com' },
  prices: {
    base_grand_total: { value: 150000 },
    subtotal_incl_tax: { value: 140000 },
    total_shipping: { value: 10000 },
  },
  createDate: '2024-01-15',
  totalQuantity: 3,
  status: 'Orden Confirmada',
  items: [
    {
      id: 1,
      name: 'Producto A',
      sku: 'SKU-001',
      quantity: 2,
      priceProvider: 50000,
      coverUrl: 'https://example.com/img.jpg',
    },
  ],
};

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <ThemeProvider theme={theme}>
      <table>
        <tbody>{ui}</tbody>
      </table>
    </ThemeProvider>
  );

describe('OrderTableRow', () => {
  it('renders order number with link', () => {
    renderWithTheme(<OrderTableRow row={mockRow as any} detailsHref="/orders/1" />);
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
  });

  it('renders customer name and email', () => {
    renderWithTheme(<OrderTableRow row={mockRow as any} detailsHref="/orders/1" />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();
  });

  it('renders formatted total price', () => {
    renderWithTheme(<OrderTableRow row={mockRow as any} detailsHref="/orders/1" />);
    expect(screen.getByText('$150000')).toBeInTheDocument();
  });

  it('renders quantity', () => {
    renderWithTheme(<OrderTableRow row={mockRow as any} detailsHref="/orders/1" />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders status label', () => {
    renderWithTheme(<OrderTableRow row={mockRow as any} detailsHref="/orders/1" />);
    expect(screen.getByTestId('order-status-label')).toHaveTextContent('Orden Confirmada');
  });

  it('renders avatar initials from customer name', () => {
    renderWithTheme(<OrderTableRow row={mockRow as any} detailsHref="/orders/1" />);
    expect(screen.getByText('JP')).toBeInTheDocument();
  });

  it('renders formatted date and time', () => {
    renderWithTheme(<OrderTableRow row={mockRow as any} detailsHref="/orders/1" />);
    expect(screen.getByText('date:2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('time:2024-01-15')).toBeInTheDocument();
  });

  it('renders provider checkbox when userRole is provider and status not in STATUS_WITHOUT_GUIDES', () => {
    renderWithTheme(
      <OrderTableRow
        row={mockRow as any}
        detailsHref="/orders/1"
        userRole="provider"
        selected={false}
        onSelectRow={jest.fn()}
      />
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders dash instead of checkbox when status is in STATUS_WITHOUT_GUIDES', () => {
    const cancelledRow = { ...mockRow, status: 'Cancelado' };
    renderWithTheme(
      <OrderTableRow
        row={cancelledRow as any}
        detailsHref="/orders/1"
        userRole="provider"
        selected={false}
        onSelectRow={jest.fn()}
      />
    );
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('does not render checkbox column when userRole is not provider', () => {
    renderWithTheme(
      <OrderTableRow row={mockRow as any} detailsHref="/orders/1" userRole="seller" />
    );
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('uses subtotal + shipping when base_grand_total is 0', () => {
    const rowWithZeroTotal = {
      ...mockRow,
      prices: {
        base_grand_total: { value: 0 },
        subtotal_incl_tax: { value: 140000 },
        total_shipping: { value: 10000 },
      },
    };
    renderWithTheme(<OrderTableRow row={rowWithZeroTotal as any} detailsHref="/orders/1" />);
    expect(screen.getByText('$150000')).toBeInTheDocument();
  });

  it('calls onSelectRow when checkbox clicked', () => {
    const onSelectRow = jest.fn();
    renderWithTheme(
      <OrderTableRow
        row={mockRow as any}
        detailsHref="/orders/1"
        userRole="provider"
        selected={false}
        onSelectRow={onSelectRow}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onSelectRow).toHaveBeenCalled();
  });
});
