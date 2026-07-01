import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import PromotionDetailClient from './promotion-detail-client';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

const mockUseGetDetail = jest.fn();
jest.mock('src/actions/promotions/use-get-seller-promotion-detail', () => ({
  useGetSellerPromotionDetail: (...args: any[]) => mockUseGetDetail(...args),
}));

jest.mock('src/components/error-content', () => ({
  ErrorContent: ({ title }: any) => <div data-testid="error-content">{title}</div>,
}));

jest.mock('src/components/loading-screen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

jest.mock('./view/promotion-detail-view', () => ({
  PromotionDetailView: ({ promotion }: any) => (
    <div data-testid="detail-view">{promotion.name}</div>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('PromotionDetailClient', () => {
  it('shows loading screen while loading', () => {
    mockUseGetDetail.mockReturnValue({ isLoading: true, isError: false });
    renderWithTheme(<PromotionDetailClient promotionId={1} />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('shows error content on error', () => {
    mockUseGetDetail.mockReturnValue({
      isLoading: false,
      isError: true,
      promotion: null,
      stats: null,
    });
    renderWithTheme(<PromotionDetailClient promotionId={1} />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('renders detail view when data is available', () => {
    mockUseGetDetail.mockReturnValue({
      isLoading: false,
      isError: false,
      promotion: { entity_id: 1, name: 'Test Promo', discount_type: 'BY_PERCENT', discount_amount: 10 },
      stats: { times_used: 5, total_discount_granted: 50000, total_revenue_generated: 500000 },
    });
    renderWithTheme(<PromotionDetailClient promotionId={1} />);
    expect(screen.getByTestId('detail-view')).toBeInTheDocument();
    expect(screen.getByText('Test Promo')).toBeInTheDocument();
  });
});
