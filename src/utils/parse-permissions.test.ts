jest.mock('src/sections/sub-account/constants/status', () => ({
  PERMISSIONS: [
    { value: 'marketplace/product/add', label: 'Create product' },
    { value: 'marketplace/account/dashboard', label: 'account/dashboard' },
    { value: 'marketplace/product/productlist', label: 'product/productlist' },
  ],
}));

import { parsePermissions } from './parse-permissions';

describe('parsePermissions', () => {
  it('returns [] for null/undefined', () => {
    expect(parsePermissions(null as any)).toEqual([]);
    expect(parsePermissions(undefined as any)).toEqual([]);
  });

  it('returns [] for empty array', () => {
    expect(parsePermissions([])).toEqual([]);
  });

  it('maps known permission key to its label', () => {
    const result = parsePermissions(['marketplace/product/add']);
    expect(result).toEqual([{ 'marketplace/product/add': 'Create product' }]);
  });

  it('maps multiple known permissions', () => {
    const result = parsePermissions(['marketplace/product/add', 'marketplace/account/dashboard']);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ 'marketplace/product/add': 'Create product' });
    expect(result[1]).toEqual({ 'marketplace/account/dashboard': 'account/dashboard' });
  });

  it('returns unknown label for unrecognized key', () => {
    const result = parsePermissions(['some/unknown/key']);
    expect(result).toEqual([{ 'some/unknown/key': 'Unknown permission: some/unknown/key' }]);
  });

  it('trims whitespace from keys', () => {
    const result = parsePermissions(['  marketplace/product/add  ']);
    expect(result).toEqual([{ 'marketplace/product/add': 'Create product' }]);
  });

  it('filters out empty strings after trim', () => {
    const result = parsePermissions(['marketplace/product/add', '  ']);
    expect(result).toHaveLength(1);
  });
});
