import { PRODUCT_STOCK_OPTIONS } from './product-constants';

describe('PRODUCT_STOCK_OPTIONS', () => {
  it('has 3 stock options', () => {
    expect(PRODUCT_STOCK_OPTIONS).toHaveLength(3);
  });

  it('contains in stock option', () => {
    const inStock = PRODUCT_STOCK_OPTIONS.find((o) => o.value === 'in stock');
    expect(inStock).toBeDefined();
    expect(inStock!.label).toBe('In stock');
  });

  it('contains low stock option', () => {
    const lowStock = PRODUCT_STOCK_OPTIONS.find((o) => o.value === 'low stock');
    expect(lowStock).toBeDefined();
    expect(lowStock!.label).toBe('Low stock');
  });

  it('contains out of stock option', () => {
    const outOfStock = PRODUCT_STOCK_OPTIONS.find((o) => o.value === 'out of stock');
    expect(outOfStock).toBeDefined();
    expect(outOfStock!.label).toBe('Out of stock');
  });

  it('all options have value and label', () => {
    PRODUCT_STOCK_OPTIONS.forEach((opt) => {
      expect(opt.value).toBeTruthy();
      expect(opt.label).toBeTruthy();
    });
  });
});
