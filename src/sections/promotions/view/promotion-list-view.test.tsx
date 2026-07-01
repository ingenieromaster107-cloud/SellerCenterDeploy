import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useGetSellerPromotions as useGetSellerPromotionsHook } from 'src/actions/promotions/use-get-seller-promotions';

import { PromotionListView } from './promotion-list-view';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/home' },
    promotions: { create: '/promotions/create', details: (id: number) => `/promotions/${id}`, edit: (id: number) => `/promotions/${id}/edit` },
  },
}));

const mockRouterPush = jest.fn();

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span data-testid="label">{children}</span>,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/components/error-content', () => ({
  ErrorContent: ({ title }: any) => <div data-testid="error-content">{title}</div>,
}));

jest.mock('src/components/snackbar', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('src/components/table', () => ({
  useTable: () => ({
    dense: false,
    order: 'desc',
    orderBy: 'from_date',
    selected: [],
    onSort: jest.fn(),
  }),
  TableNoData: ({ notFound }: any) =>
    notFound ? <tr><td data-testid="no-data">No data</td></tr> : null,
  TableSkeleton: () => <tr><td data-testid="table-skeleton">Loading...</td></tr>,
  TableEmptyRows: () => null,
  TableHeadCustom: () => <thead><tr><th>Head</th></tr></thead>,
  TablePaginationCustom: () => <div data-testid="table-pagination" />,
  getComparator: () => () => 0,
}));

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.08)',
}));

jest.mock('src/actions/promotions/use-get-seller-promotions', () => ({
  useGetSellerPromotions: jest.fn(),
}));

jest.mock('src/actions/promotions/use-pause-seller-promotion', () => ({
  usePauseSellerPromotion: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock('src/actions/promotions/use-delete-seller-promotion', () => ({
  useDeleteSellerPromotion: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock('src/actions/promotions/use-activate-seller-promotion', () => ({
  useActivateSellerPromotion: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock('../components/promotion-table-row', () => ({
  PromotionTableRow: ({ row }: any) => <tr><td data-testid="promotion-row">{row.name}</td></tr>,
}));

jest.mock('../components/promotion-table-toolbar', () => ({
  PromotionTableToolbar: ({ onSearchChange }: any) => (
    <div data-testid="promotion-toolbar">
      <input
        data-testid="search-input"
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="search"
      />
    </div>
  ),
}));

jest.mock('../resources/constants', () => ({
  PROMOTION_STATUS_COLORS: {
    ACTIVE: 'success',
    PAUSED: 'default',
    PENDING_APPROVAL: 'warning',
    EXPIRED: 'error',
    EXHAUSTED: 'info',
  },
}));

const useGetSellerPromotions = useGetSellerPromotionsHook as unknown as jest.Mock;

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockPromotion = {
  entity_id: 1,
  name: 'Promo Verano',
  coupon_code: 'VERANO10',
  discount_type: 'percentage',
  apply_type: 'cart',
  discount_amount: 10,
  from_date: '2024-06-01',
  to_date: '2024-08-31',
  times_used: 5,
  status: 'ACTIVE',
};

describe('PromotionListView', () => {
  beforeEach(() => {
    useGetSellerPromotions.mockReturnValue({
      items: [mockPromotion],
      totalCount: 1,
      isLoading: false,
      isFetching: false,
      isError: false,
    });
  });

  it('renders home content', () => {
    renderWithTheme(<PromotionListView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithTheme(<PromotionListView />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders add promotion button', () => {
    renderWithTheme(<PromotionListView />);
    expect(screen.getByText('promotionsModule.list.addPromotion')).toBeInTheDocument();
  });

  it('renders status tabs', () => {
    renderWithTheme(<PromotionListView />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders promotion toolbar', () => {
    renderWithTheme(<PromotionListView />);
    expect(screen.getByTestId('promotion-toolbar')).toBeInTheDocument();
  });

  it('renders promotion row', () => {
    renderWithTheme(<PromotionListView />);
    expect(screen.getByTestId('promotion-row')).toHaveTextContent('Promo Verano');
  });

  it('renders pagination', () => {
    renderWithTheme(<PromotionListView />);
    expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
  });

  it('renders error content when isError', () => {
    useGetSellerPromotions.mockReturnValue({
      items: [],
      totalCount: 0,
      isLoading: false,
      isFetching: false,
      isError: true,
    });
    renderWithTheme(<PromotionListView />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('renders loading skeleton when fetching', () => {
    useGetSellerPromotions.mockReturnValue({
      items: [],
      totalCount: 0,
      isLoading: true,
      isFetching: false,
      isError: false,
    });
    renderWithTheme(<PromotionListView />);
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });

  it('filters promotions by search value', () => {
    renderWithTheme(<PromotionListView />);
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    expect(screen.queryByTestId('promotion-row')).not.toBeInTheDocument();
  });

  it('navigates to create when add button clicked', () => {
    mockRouterPush.mockClear();
    renderWithTheme(<PromotionListView />);
    fireEvent.click(screen.getByText('promotionsModule.list.addPromotion'));
    expect(mockRouterPush).toHaveBeenCalledWith('/promotions/create');
  });
});
