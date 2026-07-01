import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderDetailsToolbar } from './order-details-toolbar';

jest.mock('src/routes/components', () => ({
  RouterLink: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('src/utils/format-time', () => ({
  fDateTime: (v: string) => `formatted:${v}`,
}));

jest.mock('src/sections/order/resources/constants', () => ({
  STATUS_COLORS: { 'Entregado': 'success', 'Cancelado': 'error' },
  STATUS_WITHOUT_GUIDES: ['Cancelado'],
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const baseProps = {
  status: 'Entregado',
  backHref: '/orders',
  createdAt: '2024-01-15T10:00:00Z',
  orderNumber: '100045',
  orderUid: 'abc-123',
  tracking: [],
};

describe('OrderDetailsToolbar', () => {
  it('renders order number', () => {
    renderWithTheme(<OrderDetailsToolbar {...baseProps} />);
    expect(screen.getByText(/100045/)).toBeInTheDocument();
  });

  it('renders back navigation icon', () => {
    renderWithTheme(<OrderDetailsToolbar {...baseProps} />);
    expect(screen.getByTestId('icon-eva:arrow-ios-back-fill')).toBeInTheDocument();
  });

  it('renders status label', () => {
    renderWithTheme(<OrderDetailsToolbar {...baseProps} />);
    expect(screen.getByText('Entregado')).toBeInTheDocument();
  });

  it('renders formatted creation date', () => {
    renderWithTheme(<OrderDetailsToolbar {...baseProps} />);
    expect(screen.getByText('formatted:2024-01-15T10:00:00Z')).toBeInTheDocument();
  });

  it('does not render print button when no tracking', () => {
    renderWithTheme(<OrderDetailsToolbar {...baseProps} tracking={[]} />);
    expect(screen.queryByText('Imprimir guia')).not.toBeInTheDocument();
  });

  it('renders print button when provider role and has tracking and non-excluded status', () => {
    renderWithTheme(
      <OrderDetailsToolbar
        {...baseProps}
        tracking={[{ id: '1' }]}
        userRole="provider"
        status="Entregado"
      />
    );
    expect(screen.getByText('Imprimir guia')).toBeInTheDocument();
  });

  it('does not render print button for cancelled status even with tracking', () => {
    renderWithTheme(
      <OrderDetailsToolbar
        {...baseProps}
        tracking={[{ id: '1' }]}
        userRole="provider"
        status="Cancelado"
      />
    );
    expect(screen.queryByText('Imprimir guia')).not.toBeInTheDocument();
  });
});
