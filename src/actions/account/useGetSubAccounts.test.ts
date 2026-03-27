import { renderHook } from '@testing-library/react';

import { useGetSubAccounts } from './useGetSubAccounts';

describe('useGetSubAccounts', () => {
  it('returns accounts array', () => {
    const { result } = renderHook(() => useGetSubAccounts());
    expect(Array.isArray(result.current.accounts)).toBe(true);
  });

  it('returns at least one account', () => {
    const { result } = renderHook(() => useGetSubAccounts());
    expect(result.current.accounts.length).toBeGreaterThan(0);
  });

  it('accounts have required fields', () => {
    const { result } = renderHook(() => useGetSubAccounts());
    const account = result.current.accounts[0];
    expect(account).toHaveProperty('id');
    expect(account).toHaveProperty('name');
    expect(account).toHaveProperty('email');
    expect(account).toHaveProperty('status');
    expect(account).toHaveProperty('permissions');
  });

  it('isLoading is false by default', () => {
    const { result } = renderHook(() => useGetSubAccounts());
    expect(result.current.isLoading).toBe(false);
  });
});
