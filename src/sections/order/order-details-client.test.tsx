import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import OrderDetailsClient from './order-details-client';

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

const mockUseGetOrderDetail = jest.fn();
jest.mock('src/actions/order/use-order-details', () => ({
  useGetOrderDetail: (...args: any[]) => mockUseGetOrderDetail(...args),
}));

jest.mock('src/actions/order/adapters/order-details-adapter', () => ({
  orderDetailsAdapter: (data: any) => data,
}));

jest.mock('src/components/error-content', () => ({
  ErrorContent: ({ title }: any) => <div data-testid="error-content">{title}</div>,
}));

jest.mock('src/components/loading-screen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

jest.mock('./views/order-details-view', () => ({
  OrderDetailsView: ({ order }: any) => (
    <div data-testid="order-details-view">{order?.orderNumber}</div>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('OrderDetailsClient', () => {
  it('shows loading screen while loading', () => {
    mockUseGetOrderDetail.mockReturnValue({ isLoading: true, error: null, data: undefined });
    renderWithTheme(<OrderDetailsClient orderId="ORD-001" />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('shows error content on error', () => {
    mockUseGetOrderDetail.mockReturnValue({
      isLoading: false,
      error: new Error('not found'),
      data: undefined,
    });
    renderWithTheme(<OrderDetailsClient orderId="ORD-001" />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('renders order details view when data is available', () => {
    mockUseGetOrderDetail.mockReturnValue({
      isLoading: false,
      error: null,
      data: { orderNumber: 'ORD-999' },
    });
    renderWithTheme(<OrderDetailsClient orderId="ORD-999" />);
    expect(screen.getByTestId('order-details-view')).toBeInTheDocument();
    expect(screen.getByText('ORD-999')).toBeInTheDocument();
  });
});
