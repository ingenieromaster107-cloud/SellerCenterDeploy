import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppProductRanking } from './app-product-ranking';

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows, loading }: any) => (
    <div data-testid="data-grid" data-loading={loading} data-rows={rows?.length ?? 0} />
  ),
  esES: { components: { MuiDataGrid: { defaultProps: { localeText: {} } } } },
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/utils/format-number', () => ({
  fNumber: (v: number) => String(v),
  fPercent: (v: number) => `${v}%`,
  fCurrency: (v: number) => `$${v}`,
}));

jest.mock('src/components/empty-content', () => ({
  EmptyContent: () => <div data-testid="empty-content" />,
}));

jest.mock('src/components/floating-scrollbar', () => ({
  FloatingScrollbar: ({ children }: any) => <div data-testid="floating-scrollbar">{children}</div>,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const items: any[] = [
  {
    product_id: 1,
    sku: 'SKU-001',
    product_name: 'Producto Uno',
    gross_sales: 100000,
    units_sold: 50,
    visits: 300,
    participation: 25,
  },
  {
    product_id: 2,
    sku: 'SKU-002',
    product_name: 'Producto Dos',
    gross_sales: 50000,
    units_sold: 20,
    visits: 150,
    participation: 12,
  },
];

describe('AppProductRanking', () => {
  it('renders card title', () => {
    renderWithTheme(<AppProductRanking title="Top Productos" items={[]} isLoading={false} />);
    expect(screen.getByText('Top Productos')).toBeInTheDocument();
  });

  it('renders DataGrid inside FloatingScrollbar', () => {
    renderWithTheme(<AppProductRanking title="Ranking" items={items} isLoading={false} />);
    expect(screen.getByTestId('floating-scrollbar')).toBeInTheDocument();
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
  });

  it('passes correct row count to DataGrid', () => {
    renderWithTheme(<AppProductRanking title="Ranking" items={items} isLoading={false} />);
    expect(screen.getByTestId('data-grid')).toHaveAttribute('data-rows', '2');
  });

  it('passes loading state to DataGrid', () => {
    renderWithTheme(<AppProductRanking title="Ranking" items={[]} isLoading />);
    expect(screen.getByTestId('data-grid')).toHaveAttribute('data-loading', 'true');
  });

  it('passes not-loading to DataGrid when not loading', () => {
    renderWithTheme(<AppProductRanking title="Ranking" items={items} isLoading={false} />);
    expect(screen.getByTestId('data-grid')).toHaveAttribute('data-loading', 'false');
  });

  it('renders without title', () => {
    renderWithTheme(<AppProductRanking items={[]} isLoading={false} />);
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
  });
});
