import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import ClientsView from './clients-view';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/routes/paths', () => ({
  paths: { home: { root: '/home' } },
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children, className }: any) => (
    <div data-testid="home-content" className={className}>{children}</div>
  ),
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span data-testid="label">{children}</span>,
}));

jest.mock('src/hooks/clients/use-client-list', () => ({
  useClientList: () => ({
    clientList: [
      {
        full_name: 'María López',
        email: 'maria@example.com',
        location: 'Bogotá',
        customer_since: '2023-01-01',
      },
    ],
    tableHead: [{ id: 'full_name', label: 'Nombre' }],
  }),
}));

const mockUseSellerLoyalty = jest.fn((..._args: any[]) => ({
  summary: {},
  loyaltyByEmail: new Map([['maria@example.com', { ordersCount: 5, classification: 'FREQUENT' }]]),
  isLoading: false,
}));

jest.mock('src/hooks/clients/use-seller-loyalty', () => ({
  useSellerLoyalty: (...args: any[]) => mockUseSellerLoyalty(...args),
}));

jest.mock('../components/loyalty-summary-cards', () => ({
  LoyaltySummaryCards: () => <div data-testid="loyalty-summary" />,
}));

jest.mock('src/sections/common', () => ({
  CommonTable: ({ renderCell, contentTable }: any) => (
    <div data-testid="common-table">
      {contentTable.map((item: any, i: number) => (
        <div key={i} data-testid="table-row">
          {renderCell(item, i)}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../constants', () => ({
  LOYALTY_CLASSIFICATION: {
    FREQUENT: { labelKey: 'clientsModule.loyalty.classification.frequent', color: 'success' },
    NEW: { labelKey: 'clientsModule.loyalty.classification.new', color: 'info' },
  },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ClientsView', () => {
  it('renders home content with clients-view class', () => {
    renderWithTheme(<ClientsView />);
    const homeContent = screen.getByTestId('home-content');
    expect(homeContent).toBeInTheDocument();
    expect(homeContent).toHaveClass('clients-view');
  });

  it('renders breadcrumbs with clients title', () => {
    renderWithTheme(<ClientsView />);
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('clientsModule.title');
  });

  it('renders loyalty summary cards', () => {
    renderWithTheme(<ClientsView />);
    expect(screen.getByTestId('loyalty-summary')).toBeInTheDocument();
  });

  it('renders common table', () => {
    renderWithTheme(<ClientsView />);
    expect(screen.getByTestId('common-table')).toBeInTheDocument();
  });

  it('renders client row with name and email', () => {
    renderWithTheme(<ClientsView />);
    expect(screen.getByText('María López')).toBeInTheDocument();
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();
  });

  it('renders loyalty label for client', () => {
    renderWithTheme(<ClientsView />);
    expect(screen.getByText('clientsModule.loyalty.classification.frequent')).toBeInTheDocument();
  });

  it('renders order count for client', () => {
    renderWithTheme(<ClientsView />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders NEW classification for unknown loyalty', () => {
    mockUseSellerLoyalty.mockReturnValueOnce({
      summary: {},
      loyaltyByEmail: new Map(),
      isLoading: false,
    });
    renderWithTheme(<ClientsView />);
    expect(screen.getByText('clientsModule.loyalty.classification.new')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
