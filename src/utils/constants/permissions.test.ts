import { Permission } from './permissions';

describe('Permission enum', () => {
  it('should have the correct value for marketplace/product/productlist', () => {
    expect(Permission['marketplace/product/productlist']).toBe('Product List');
  });

  it('should have the correct value for marketplace/account/dashboard', () => {
    expect(Permission['marketplace/account/dashboard']).toBe('Account Dashboard');
  });

  it('should have the correct value for marketplace/product/add', () => {
    expect(Permission['marketplace/product/add']).toBe('Create Product');
  });

  it('should have the correct value for marketplace/account/customer', () => {
    expect(Permission['marketplace/account/customer']).toBe('Customer List');
  });

  it('should have the correct value for marketplace/account/review', () => {
    expect(Permission['marketplace/account/review']).toBe('Review List');
  });

  it('should contain exactly 5 entries', () => {
    const keys = Object.keys(Permission);
    expect(keys.length).toBe(5);
  });

  it('should not have unexpected keys', () => {
    const expectedKeys = [
      'marketplace/product/productlist',
      'marketplace/account/dashboard',
      'marketplace/product/add',
      'marketplace/account/customer',
      'marketplace/account/review',
    ];
    const actualKeys = Object.keys(Permission);
    expect(actualKeys).toEqual(expect.arrayContaining(expectedKeys));
    expect(expectedKeys).toEqual(expect.arrayContaining(actualKeys));
  });

  it('should not have unexpected values', () => {
    const expectedValues = [
      'Product List',
      'Account Dashboard',
      'Create Product',
      'Customer List',
      'Review List',
    ];
    const actualValues = Object.values(Permission);
    expect(actualValues).toEqual(expect.arrayContaining(expectedValues));
    expect(expectedValues).toEqual(expect.arrayContaining(actualValues));
  });
});
