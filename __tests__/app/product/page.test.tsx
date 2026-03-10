import { render, screen } from '@testing-library/react';

import Page, { metadata } from 'src/app/product/page';

jest.mock('src/sections/product/view', () => ({
  ProductListView: () => <div data-testid="product-list-view">Product List View</div>,
}));

describe('Product page', () => {
  it('should expose the expected metadata title', () => {
    expect(metadata.title).toBe('Product list - Seller Center MitiMiti');
  });

  it('should render ProductListView', () => {
    render(<Page />);

    expect(screen.getByTestId('product-list-view')).toBeInTheDocument();
  });
});
