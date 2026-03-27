import type { AuthContextValue } from '../types';

import { renderHook } from '@testing-library/react';

import { useAuthContext } from './use-auth-context';
import { AuthContext } from '../context/auth-context';

describe('useAuthContext', () => {
  it('returns context value when used inside AuthContext provider', () => {
    const value: AuthContextValue = {
      user: { id: '1' },
      loading: false,
      authenticated: true,
      unauthenticated: false,
      checkUserSession: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    expect(result.current).toBe(value);
  });

  it('throws when used outside AuthContext provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAuthContext())).toThrow(
      'useAuthContext: Context must be used inside AuthProvider'
    );

    consoleError.mockRestore();
  });
});
