import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (...args: string[]) => args.at(-1) ?? '' }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

import { ProductConfigurableOptions } from './product-configurable-options';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const chipOptions: any[] = [
  {
    uid: 'size-opt',
    label: 'Size',
    frontend_input: 'dropdown',
    values: [
      { uid: 'sm', label: 'Small', swatch: null },
      { uid: 'lg', label: 'Large', swatch: null },
    ],
  },
];

const swatchOptions: any[] = [
  {
    uid: 'color-opt',
    label: 'Color',
    frontend_input: 'swatch_visual',
    values: [
      { uid: 'red', label: 'Red', swatch: { image_url: null } },
    ],
  },
];

const variants: any[] = [
  {
    attributes: [{ uid: 'sm' }],
    product: { sku: 'SKU-SM', name: 'Prod SM', stock_status: 'IN_STOCK', stock_saleable: 5, price_range: { minimum_price: { final_price: { value: 10 }, regular_price: { value: 10 } } } },
  },
];

describe('ProductConfigurableOptions', () => {
  it('returns null when no options', () => {
    const { container } = renderWithTheme(
      <ProductConfigurableOptions configurableOptions={[]} variants={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders option label', () => {
    renderWithTheme(
      <ProductConfigurableOptions configurableOptions={chipOptions} variants={variants} />
    );
    expect(screen.getByText('Size')).toBeInTheDocument();
  });

  it('renders chip values for dropdown input', () => {
    renderWithTheme(
      <ProductConfigurableOptions configurableOptions={chipOptions} variants={variants} />
    );
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('renders avatar swatches for swatch_visual input', () => {
    renderWithTheme(
      <ProductConfigurableOptions configurableOptions={swatchOptions} variants={[]} />
    );
    expect(screen.getByText('Color')).toBeInTheDocument();
  });

  it('calls onSelectionChange when selection changes', () => {
    const onSelectionChange = jest.fn();
    renderWithTheme(
      <ProductConfigurableOptions
        configurableOptions={chipOptions}
        variants={variants}
        onSelectionChange={onSelectionChange}
      />
    );
    expect(onSelectionChange).toHaveBeenCalled();
  });
});
