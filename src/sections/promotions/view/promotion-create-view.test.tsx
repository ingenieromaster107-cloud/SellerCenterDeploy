import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { PromotionCreateView } from './promotion-create-view';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/' },
    promotions: { root: '/promotions', list: '/promotions/list', create: '/promotions/create' },
  },
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('src/actions/promotions/use-create-seller-promotion', () => ({
  useCreateSellerPromotion: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock('src/components/snackbar', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('../components/promotion-form', () => ({
  PromotionForm: () => <div data-testid="promotion-form" />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('PromotionCreateView', () => {
  it('renders home content', () => {
    renderWithTheme(<PromotionCreateView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs with heading', () => {
    renderWithTheme(<PromotionCreateView />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('promotionsModule.create.heading')).toBeInTheDocument();
  });

  it('renders promotion form', () => {
    renderWithTheme(<PromotionCreateView />);
    expect(screen.getByTestId('promotion-form')).toBeInTheDocument();
  });
});
