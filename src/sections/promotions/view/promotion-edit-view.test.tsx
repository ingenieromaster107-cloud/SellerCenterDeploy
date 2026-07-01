import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { PromotionEditView } from './promotion-edit-view';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/' },
    promotions: {
      root: '/promotions',
      details: (id: number) => `/promotions/${id}`,
    },
  },
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('src/actions/promotions/use-update-seller-promotion', () => ({
  useUpdateSellerPromotion: () => ({ mutate: jest.fn(), isPending: false }),
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
  PromotionForm: ({ mode }: any) => <div data-testid="promotion-form" data-mode={mode} />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const promotion: any = {
  entity_id: 42,
  name: 'Promo Verano',
  status: 'ACTIVE',
  discount_type: 'BY_PERCENT',
  discount_amount: 15,
  apply_type: 'ALL',
  from_date: '2024-06-01',
};

describe('PromotionEditView', () => {
  it('renders home content', () => {
    renderWithTheme(<PromotionEditView promotion={promotion} />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs with edit heading', () => {
    renderWithTheme(<PromotionEditView promotion={promotion} />);
    expect(screen.getByText('promotionsModule.edit.heading')).toBeInTheDocument();
  });

  it('renders promotion form in edit mode', () => {
    renderWithTheme(<PromotionEditView promotion={promotion} />);
    const form = screen.getByTestId('promotion-form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('data-mode', 'edit');
  });
});
