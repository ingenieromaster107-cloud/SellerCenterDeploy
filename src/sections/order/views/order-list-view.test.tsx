import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderListView } from './order-list-view';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    order: { root: '/orders', details: (id: string) => `/orders/${id}` },
    home: { root: '/' },
  },
}));

jest.mock('src/hooks/orders/use-orders', () => ({
  useOrders: () => ({
    TABLE_ORDER_HEAD: [
      { id: 'order', label: 'Orden' },
      { id: 'customer', label: 'Cliente' },
      { id: 'status', label: 'Estado' },
    ],
  }),
}));

const mockUseGetOrders = jest.fn();
jest.mock('src/actions/order/use-get-orders', () => ({
  useGetOrders: (...args: any[]) => mockUseGetOrders(...args),
}));

jest.mock('src/actions/order/adapters/order-list-adapter', () => ({
  adaptOrderListResponse: (data: any) => data,
}));

jest.mock('src/utils/format-time', () => ({
  fIsAfter: () => false,
  fIsBetween: () => true,
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/components/error-content', () => ({
  ErrorContent: ({ title }: any) => <div data-testid="error-content">{title}</div>,
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/components/table', () => ({
  useTable: () => ({
    dense: false, order: 'desc', orderBy: 'createdAt',
    page: 0, rowsPerPage: 10, selected: [],
    onSort: jest.fn(), onResetPage: jest.fn(),
    onChangeDense: jest.fn(), onSelectRow: jest.fn(),
    onSelectAllRows: jest.fn(),
  }),
  emptyRows: () => 0,
  TableNoData: ({ notFound }: any) => notFound ? <div>No data</div> : null,
  TableSkeleton: () => <div data-testid="skeleton" />,
  getComparator: () => () => 0,
  TableEmptyRows: () => null,
  TableHeadCustom: ({ headCells }: any) => (
    <thead><tr>{headCells.map((c: any) => <th key={c.id}>{c.label}</th>)}</tr></thead>
  ),
  TableSelectedAction: () => null,
  TablePaginationCustom: () => <div data-testid="pagination" />,
}));

jest.mock('../components/order-table-row', () => ({
  OrderTableRow: ({ row }: any) => <tr><td>{row.orderNumber}</td></tr>,
}));

jest.mock('../components/order-table-toolbar', () => ({
  OrderTableToolbar: () => <div data-testid="toolbar" />,
}));

jest.mock('../components/order-table-filters-results', () => ({
  OrderTableFiltersResult: () => <div data-testid="filters-result" />,
}));

jest.mock('src/sections/order/resources/constants', () => ({
  STATUS_COLORS: { Entregado: 'success' },
  STATUS_WITHOUT_GUIDES: ['Cancelado'],
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('OrderListView', () => {
  it('renders breadcrumbs when loaded', () => {
    mockUseGetOrders.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      totalCount: 0,
    });
    renderWithTheme(<OrderListView />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders toolbar', () => {
    mockUseGetOrders.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      totalCount: 0,
    });
    renderWithTheme(<OrderListView />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('renders skeleton while loading', () => {
    mockUseGetOrders.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      totalCount: 0,
    });
    renderWithTheme(<OrderListView />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders error content on error', () => {
    mockUseGetOrders.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      totalCount: 0,
    });
    renderWithTheme(<OrderListView />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('renders table rows when data is available', () => {
    mockUseGetOrders.mockReturnValue({
      data: [
        {
          orderNumber: 'ORD-001',
          customer: { name: 'Juan', email: 'j@t.com' },
          status: 'Entregado',
          createDate: '2024-01-01',
        },
      ],
      isLoading: false,
      isError: false,
      totalCount: 1,
    });
    renderWithTheme(<OrderListView />);
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
  });

  it('renders pagination', () => {
    mockUseGetOrders.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      totalCount: 0,
    });
    renderWithTheme(<OrderListView />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
