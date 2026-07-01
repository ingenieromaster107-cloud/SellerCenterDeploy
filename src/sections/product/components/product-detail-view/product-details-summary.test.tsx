import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

jest.mock('src/utils/format-number', () => ({
  fCurrency: (val: number) => `$${val}`,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (...args: string[]) => args.at(-1) ?? '' }),
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
}));

jest.mock('./product-promotions', () => ({
  ProductPromotions: ({ promotions }: any) => (
    <div data-testid="product-promotions">{promotions?.length}</div>
  ),
}));

jest.mock('./product-configurable-options', () => ({
  ProductConfigurableOptions: () => <div data-testid="configurable-options" />,
}));

import { ProductDetailsSummary } from './product-details-summary';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const product: any = {
  id: '1',
  name: 'Test Product',
  sku: 'SKU-001',
  category: 'Electronics',
  inStock: true,
  stock: 10,
  price: 99.99,
  discountPercent: 0,
  configurableOptions: [],
  variants: [],
  promotions: [],
};

describe('ProductDetailsSummary', () => {
  it('renders product name', () => {
    renderWithTheme(<ProductDetailsSummary product={product} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product SKU', () => {
    renderWithTheme(<ProductDetailsSummary product={product} />);
    expect(screen.getByText('SKU-001')).toBeInTheDocument();
  });

  it('renders product category', () => {
    renderWithTheme(<ProductDetailsSummary product={product} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('renders product price', () => {
    renderWithTheme(<ProductDetailsSummary product={product} />);
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders promotions section when promotions exist', () => {
    const productWithPromos = { ...product, promotions: [{ id: 'p1', name: 'Sale' }] };
    renderWithTheme(<ProductDetailsSummary product={productWithPromos} />);
    expect(screen.getByTestId('product-promotions')).toBeInTheDocument();
  });

  it('does not render promotions section when empty', () => {
    renderWithTheme(<ProductDetailsSummary product={product} />);
    expect(screen.queryByTestId('product-promotions')).not.toBeInTheDocument();
  });

  it('renders configurable options when present', () => {
    const configurableProduct = {
      ...product,
      configurableOptions: [{ uid: 'opt1', label: 'Size', values: [] }],
      variants: [{ attributes: [], product: {} }],
    };
    renderWithTheme(<ProductDetailsSummary product={configurableProduct} />);
    expect(screen.getByTestId('configurable-options')).toBeInTheDocument();
  });

  it('renders discount when discountPercent > 0', () => {
    const discountProduct = { ...product, discountPercent: 20 };
    renderWithTheme(<ProductDetailsSummary product={discountProduct} />);
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });
});
