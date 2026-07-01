import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import PromotionEditClient from './promotion-edit-client';

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

jest.mock('./view/promotion-edit-view', () => ({
  PromotionEditView: ({ promotion }: any) => (
    <div data-testid="edit-view">{promotion.name}</div>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('PromotionEditClient', () => {
  it('shows loading screen while loading', () => {
    mockUseGetDetail.mockReturnValue({ isLoading: true, isError: false });
    renderWithTheme(<PromotionEditClient promotionId={1} />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('shows error content on error', () => {
    mockUseGetDetail.mockReturnValue({
      isLoading: false,
      isError: true,
      promotion: null,
    });
    renderWithTheme(<PromotionEditClient promotionId={1} />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('shows error content when promotion is null', () => {
    mockUseGetDetail.mockReturnValue({
      isLoading: false,
      isError: false,
      promotion: null,
    });
    renderWithTheme(<PromotionEditClient promotionId={1} />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('renders edit view when data is available', () => {
    mockUseGetDetail.mockReturnValue({
      isLoading: false,
      isError: false,
      promotion: { entity_id: 1, name: 'Promo Editable', discount_type: 'BY_PERCENT' },
    });
    renderWithTheme(<PromotionEditClient promotionId={1} />);
    expect(screen.getByTestId('edit-view')).toBeInTheDocument();
    expect(screen.getByText('Promo Editable')).toBeInTheDocument();
  });
});
