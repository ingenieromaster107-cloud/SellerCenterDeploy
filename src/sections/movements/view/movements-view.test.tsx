import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MovementsView } from './movements-view';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/routes/paths', () => ({
  paths: { home: { root: '/home' } },
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/hooks/movements/use-movements-filters', () => ({
  useMovementsFilters: () => ({
    filters: { dateFrom: '2024-01-01', dateTo: '2024-01-31', categories: [] },
    pagination: { page: 0, pageSize: 20 },
    setDateRange: jest.fn(),
    toggleCategory: jest.fn(),
    setPagination: jest.fn(),
  }),
}));

jest.mock('src/actions/movements/use-get-movements-summary', () => ({
  useGetMovementsSummary: () => ({
    summary: { gross_sales: 100000, total_commissions: 10000, total_refunds: 5000, net_seller: 85000, movements_count: 10 },
    isLoading: false,
  }),
}));

jest.mock('src/actions/movements/use-get-movements-list', () => ({
  useGetMovementsList: () => ({
    items: [],
    totalCount: 0,
    isFetching: false,
  }),
}));

jest.mock('src/actions/movements/use-export-movements', () => ({
  useExportMovements: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

jest.mock('src/utils/download-blob', () => ({
  downloadCsvBlob: jest.fn(),
}));

jest.mock('../components/movements-summary', () => ({
  MovementsSummaryCards: () => <div data-testid="movements-summary" />,
}));

jest.mock('../components/movements-table', () => ({
  MovementsTable: () => <div data-testid="movements-table" />,
}));

jest.mock('../constants', () => ({
  EXPORT_MAX_ROWS: 1000,
}));

jest.mock('sonner', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('MovementsView', () => {
  it('renders home content wrapper', () => {
    renderWithTheme(<MovementsView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs with movements title', () => {
    renderWithTheme(<MovementsView />);
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('movements.title');
  });

  it('renders movements summary cards', () => {
    renderWithTheme(<MovementsView />);
    expect(screen.getByTestId('movements-summary')).toBeInTheDocument();
  });

  it('renders movements table', () => {
    renderWithTheme(<MovementsView />);
    expect(screen.getByTestId('movements-table')).toBeInTheDocument();
  });
});
