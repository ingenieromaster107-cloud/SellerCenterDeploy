import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OverviewAppView } from './overview-app-view';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (ns: string, key?: string) => (key ? `${ns}.${key}` : ns),
    currentLang: 'es',
  }),
}));

const mockUseReputation = jest.fn();

jest.mock('src/hooks/dashboard/use-seller-reputation-indicators', () => ({
  useSellerReputationIndicators: () => mockUseReputation(),
}));

jest.mock('src/hooks/dashboard/use-seller-product-ranking', () => ({
  useSellerProductRanking: () => ({
    items: [],
    isLoading: false,
    isError: false,
  }),
}));

jest.mock('../../reputation-panel/components', () => ({
  ReputationPanelSkeleton: () => <div data-testid="reputation-skeleton" />,
}));

jest.mock('../../reputation-panel/app-reputation-panel', () => ({
  AppReputationPanel: ({ data }: any) => (
    <div data-testid="reputation-panel" data-level={String(data?.reputation_level)} />
  ),
}));

jest.mock('src/hooks/dashboard/use-dashboard-data', () => ({
  useDashboardData: () => ({
    topProducts: [],
    topCustomers: [],
    averageOrderValue: {
      avg_order_value: '0',
      graph_data: [],
      graph_x_value: [],
    },
    totalSales: {
      total_sale_amount: '0',
      graph_data: [],
      graph_x_value: [],
    },
    ordersOverTime: {
      graph_data: [],
      graph_x_value: [],
    },
    isLoading: false,
  }),
}));

jest.mock('src/_mock', () => ({
  _appInvoices: [],
}));

jest.mock('src/components/loading-screen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

jest.mock('./app-kpi-card', () => ({
  AppKpiCard: ({ title }: any) => <div data-testid="kpi-card">{title}</div>,
}));

jest.mock('../app-top-products', () => ({
  AppTopProducts: ({ title }: any) => <div data-testid="top-products">{title}</div>,
}));

jest.mock('../app-new-invoices', () => ({
  AppNewInvoices: ({ title }: any) => <div data-testid="new-invoices">{title}</div>,
}));

jest.mock('../app-top-customers', () => ({
  AppTopCustomers: ({ title }: any) => <div data-testid="top-customers">{title}</div>,
}));

jest.mock('../app-product-ranking', () => ({
  AppProductRanking: ({ title }: any) => <div data-testid="product-ranking">{title}</div>,
}));

describe('OverviewAppView', () => {
  beforeEach(() => {
    mockUseReputation.mockReturnValue({
      reputation: { success: true, message: 'ok', data: { reputation_level: 'GREEN' } },
      isLoading: false,
    });
  });

  it('renders home content wrapper', () => {
    renderWithTheme(<OverviewAppView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders three KPI cards', () => {
    renderWithTheme(<OverviewAppView />);
    const kpiCards = screen.getAllByTestId('kpi-card');
    expect(kpiCards).toHaveLength(3);
  });

  it('renders latest invoices, products and customers sections', () => {
    renderWithTheme(<OverviewAppView />);
    expect(screen.getByTestId('new-invoices')).toBeInTheDocument();
    expect(screen.getByTestId('top-products')).toBeInTheDocument();
    expect(screen.getByTestId('top-customers')).toBeInTheDocument();
  });

  it('does not render loading screen when data is loaded', () => {
    renderWithTheme(<OverviewAppView />);
    expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
  });

  it('shows the reputation skeleton while reputation is loading', () => {
    mockUseReputation.mockReturnValue({
      reputation: { success: false, message: '', data: null },
      isLoading: true,
    });

    renderWithTheme(<OverviewAppView />);

    expect(screen.getByTestId('reputation-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('reputation-panel')).not.toBeInTheDocument();
  });

  it('shows the reputation panel with data when not loading', () => {
    renderWithTheme(<OverviewAppView />);

    const panel = screen.getByTestId('reputation-panel');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('data-level', 'GREEN');
    expect(screen.queryByTestId('reputation-skeleton')).not.toBeInTheDocument();
  });
});
