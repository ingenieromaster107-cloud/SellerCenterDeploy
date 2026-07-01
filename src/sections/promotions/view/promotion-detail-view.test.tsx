import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { PromotionDetailView } from './promotion-detail-view';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/' },
    promotions: { root: '/promotions' },
  },
}));

jest.mock('src/utils/format-time', () => ({
  fDate: (v: string) => `date:${v}`,
}));

jest.mock('src/utils/format-number', () => ({
  fCurrency: (v: number) => `$${v}`,
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../components/promotion-status-chip', () => ({
  PromotionStatusChip: ({ status }: any) => <span data-testid="status-chip">{status}</span>,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const promotion: any = {
  name: 'Super Descuento 20%',
  status: 'ACTIVE',
  discount_type: 'BY_PERCENT',
  discount_amount: 20,
  apply_type: 'ALL',
  from_date: '2024-01-01',
  to_date: '2024-12-31',
  coupon_code: 'SAVE20',
  max_budget: 1000000,
  budget_spent: 250000,
  usage_limit: 100,
  times_used: 15,
  uses_per_customer: 1,
  applies_to_all_products: true,
  created_at: '2024-01-01',
  description: 'Descuento del 20% en todos los productos.',
};

const stats: any = {
  times_used: 15,
  total_discount_granted: 250000,
  total_revenue_generated: 1250000,
};

describe('PromotionDetailView', () => {
  it('renders promotion name in breadcrumbs', () => {
    renderWithTheme(<PromotionDetailView promotion={promotion} stats={stats} />);
    expect(screen.getByText('Super Descuento 20%')).toBeInTheDocument();
  });

  it('renders status chip', () => {
    renderWithTheme(<PromotionDetailView promotion={promotion} stats={stats} />);
    expect(screen.getByTestId('status-chip')).toHaveTextContent('ACTIVE');
  });

  it('renders times used stat', () => {
    renderWithTheme(<PromotionDetailView promotion={promotion} stats={stats} />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders total discount granted', () => {
    renderWithTheme(<PromotionDetailView promotion={promotion} stats={stats} />);
    expect(screen.getByText('$250000')).toBeInTheDocument();
  });

  it('renders coupon code when provided', () => {
    renderWithTheme(<PromotionDetailView promotion={promotion} stats={stats} />);
    expect(screen.getByText('SAVE20')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    renderWithTheme(<PromotionDetailView promotion={promotion} stats={stats} />);
    expect(screen.getByText('Descuento del 20% en todos los productos.')).toBeInTheDocument();
  });
});
