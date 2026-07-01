import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MovementsTable } from './movements-table';

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows, loading, slots }: any) => (
    <div data-testid="data-grid" data-loading={loading} data-rows={rows?.length ?? 0}>
      {slots?.toolbar && <slots.toolbar />}
    </div>
  ),
  esES: { components: { MuiDataGrid: { defaultProps: { localeText: {} } } } },
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/utils/format-number', () => ({
  fCurrencyCop: (v: number) => `COP${v}`,
}));

jest.mock('src/utils/format-time', () => ({
  fDate: (v: string) => `date:${v}`,
  FORMAT_PATTERNS: { paramCase: { date: 'yyyy-MM-dd' } },
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span data-testid="label">{children}</span>,
}));

jest.mock('src/components/loading-screen', () => ({
  SectionLoadingOverlay: ({ open, message }: any) =>
    open ? <div data-testid="loading-overlay">{message}</div> : null,
}));

jest.mock('./movements-empty', () => ({
  MovementsEmpty: () => <div data-testid="movements-empty" />,
}));

jest.mock('./movements-table-toolbar', () => ({
  MovementsTableToolbar: ({ onExport }: any) => (
    <div data-testid="movements-toolbar">
      <button onClick={onExport}>Export</button>
    </div>
  ),
}));

jest.mock('../constants', () => ({
  MOVEMENT_CATEGORY: { SALE: 'SALE', COMMISSION: 'COMMISSION', REFUND: 'REFUND' },
  MOVEMENT_CATEGORY_COLOR: { SALE: 'success', COMMISSION: 'warning', REFUND: 'error' },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const defaultProps = {
  rows: [],
  totalCount: 0,
  isLoading: false,
  pagination: { page: 0, pageSize: 10 },
  onPaginationChange: jest.fn(),
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31',
  activeCategories: [],
  onDateRangeChange: jest.fn(),
  onExport: jest.fn(),
  isExporting: false,
  exportLimitExceeded: false,
};

describe('MovementsTable', () => {
  it('renders the DataGrid', () => {
    renderWithTheme(<MovementsTable {...defaultProps} />);
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
  });

  it('shows loading overlay when isLoading is true', () => {
    renderWithTheme(<MovementsTable {...defaultProps} isLoading />);
    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
  });

  it('does not show loading overlay when not loading', () => {
    renderWithTheme(<MovementsTable {...defaultProps} isLoading={false} />);
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
  });

  it('renders the toolbar slot via DataGrid slots', () => {
    renderWithTheme(<MovementsTable {...defaultProps} />);
    expect(screen.getByTestId('movements-toolbar')).toBeInTheDocument();
  });

  it('passes correct row count to DataGrid', () => {
    const rows = [
      {
        movement_id: 'm1',
        order_increment_id: 'ORD-1',
        category: 'SALE',
        amount: 10000,
        commission_value: 1000,
        net_value: 9000,
        created_at: '2024-06-01',
        product_name: 'Test Product',
        guide_number: 'G001',
        order_status: 'delivered',
      },
    ];
    renderWithTheme(<MovementsTable {...defaultProps} rows={rows as any} totalCount={1} />);
    const grid = screen.getByTestId('data-grid');
    expect(grid).toHaveAttribute('data-rows', '1');
  });
});
