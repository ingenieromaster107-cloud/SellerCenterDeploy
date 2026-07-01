import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProductDetailsToolbar } from './product-details-toolbar';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const product: any = {
  id: '1',
  name: 'Test Product',
  sku: 'SKU-001',
};

describe('ProductDetailsToolbar', () => {
  it('renders without crashing', () => {
    expect(() =>
      renderWithTheme(
        <ProductDetailsToolbar
          publish="published"
          onChangePublish={jest.fn()}
          product={product}
        />
      )
    ).not.toThrow();
  });

  it('renders a box element', () => {
    const { container } = renderWithTheme(
      <ProductDetailsToolbar
        publish="published"
        onChangePublish={jest.fn()}
        product={product}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('calls onChangePublish when triggered', () => {
    const onChangePublish = jest.fn();
    renderWithTheme(
      <ProductDetailsToolbar
        publish="draft"
        onChangePublish={onChangePublish}
        product={product}
      />
    );
    expect(onChangePublish).not.toHaveBeenCalled();
  });
});
