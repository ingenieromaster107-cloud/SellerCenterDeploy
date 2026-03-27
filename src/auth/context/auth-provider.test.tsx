import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { AuthProvider } from './auth-provider';
import { useAuthContextTest } from './auth-context';
import { ACCESS_TOKEN_STORAGE_KEY } from './constant';

const setSessionMock = jest.fn();

jest.mock('./utils', () => ({
  setSession: (...args: any[]) => setSessionMock(...args),
}));

jest.mock('src/auth/hooks', () => ({
  useMockedUser: () => ({
    user: { id: '1', name: 'Juan' },
  }),
}));

jest.mock('minimal-shared/hooks', () => ({
  useSetState: (initial: any) => {
    const [state, setState] = React.useState(initial);
    return {
      state,
      setState: (patch: any) => setState((prev: any) => ({ ...prev, ...patch })),
    };
  },
}));

jest.mock('./auth-context', () => {
  const Ctx = React.createContext<any>(null);

  return {
    AuthContext: ({ value, children }: any) => <Ctx.Provider value={value}>{children}</Ctx.Provider>,
    useAuthContextTest: () => React.useContext(Ctx),
  };
});

function Probe() {
  const ctx = useAuthContextTest();

  if (!ctx) return null;
  return (
    <div>
      <span data-testid="loading">{String(ctx.loading)}</span>
      <span data-testid="authenticated">{String(ctx.authenticated)}</span>
      <span data-testid="unauthenticated">{String(ctx.unauthenticated)}</span>
      <span data-testid="role">{ctx.user?.role ?? 'none'}</span>
      <button onClick={ctx.checkUserSession}>check</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    sessionStorage.clear();
    setSessionMock.mockReset();
  });

  it('sets unauthenticated when no token', async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('unauthenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
  });

  it('sets authenticated and default role when token exists', async () => {
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'token');
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(setSessionMock).toHaveBeenCalledWith('token');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('role')).toHaveTextContent('admin');
    });
  });
});
