import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('minimal-shared/hooks', () => ({
  useSetState: <T extends object>(initialState: T) => {
    const ReactActual = jest.requireActual('react');
    const [state, setState] = ReactActual.useState(initialState);
    return {
      setState: (update: Partial<T>) => setState((prev: T) => ({ ...prev, ...update })),
      state,
    };
  },
}));

import { AuthContext } from './auth-context';
import { AuthProvider } from './auth-provider';
import { ACCESS_TOKEN_STORAGE_KEY } from './constant';

const mockedSetSession = jest.fn();
const mockedUser = { id: 'u-1', name: 'User A', role: 'seller' };
const mockedUseMockedUser = jest.fn(() => ({ user: mockedUser }));

jest.mock('src/auth/hooks', () => ({
  useMockedUser: () => mockedUseMockedUser(),
}));

jest.mock('./utils', () => ({
  setSession: (token: string) => mockedSetSession(token),
}));

const Consumer = () => (
  <AuthContext.Consumer>
    {(value) => (
      <div>
        <div data-testid="loading">{String(value?.loading)}</div>
        <div data-testid="auth">{String(value?.authenticated)}</div>
        <div data-testid="unauth">{String(value?.unauthenticated)}</div>
        <div data-testid="name">{value?.user?.name ?? 'none'}</div>
      </div>
    )}
  </AuthContext.Consumer>
);

describe('auth context/provider coverage harness', () => {
  beforeEach(() => {
    mockedSetSession.mockReset();
    mockedUseMockedUser.mockClear();
    sessionStorage.clear();
  });

  it('provides unauthenticated state without token', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('auth')).toHaveTextContent('false');
    expect(screen.getByTestId('unauth')).toHaveTextContent('true');
    expect(screen.getByTestId('name')).toHaveTextContent('none');
  });

  it('provides authenticated state with token and default role fallback branch', async () => {
    mockedUseMockedUser.mockReturnValueOnce({ user: { id: 'u-2', name: 'NoRoleUser' } });
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'token-123');

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(mockedSetSession).toHaveBeenCalledWith('token-123');
    expect(screen.getByTestId('auth')).toHaveTextContent('true');
    expect(screen.getByTestId('unauth')).toHaveTextContent('false');
    expect(screen.getByTestId('name')).toHaveTextContent('NoRoleUser');
  });
});
