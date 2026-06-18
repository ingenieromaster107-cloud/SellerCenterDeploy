import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { AuthProvider } from './auth-provider';
import { MS_PER_HOUR, TOKEN_REFRESH_RATIO } from './constant';

// Captured props/handlers from mocked children (must be `mock`-prefixed to be
// referenced inside jest.mock factories).
let mockIdleProps: { timeout: number; onIdle: () => void } | null = null;
let mockUnauthorizedHandler: (() => void) | null = null;

const mockReplace = jest.fn();
const mockSetHeader = jest.fn();
const mockPurge = jest.fn();
const mockRefreshToken = jest.fn();
const mockGetSession = jest.fn<string | null, []>(() => 'token');
const mockUseTokenLifetime = jest.fn<{ data: number | null | undefined }, []>(() => ({ data: null }));
const mockUseCurrentUser = jest.fn(() => ({
  data: { id: '1', firstname: 'Ana' } as any,
  isLoading: false,
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({
      setHeader: mockSetHeader,
      setUnauthorizedHandler: (handler: (() => void) | null) => {
        mockUnauthorizedHandler = handler;
      },
    }),
  },
}));

jest.mock('src/actions/auth/use-token-lifetime', () => ({
  useTokenLifetime: () => mockUseTokenLifetime(),
}));

jest.mock('src/actions/auth/use-current-user', () => ({
  useCurrentUser: () => mockUseCurrentUser(),
}));

jest.mock('src/actions/auth/use-login', () => ({
  useLogin: () => ({ mutateAsync: jest.fn() }),
}));
jest.mock('src/actions/auth/use-logout', () => ({
  useLogout: () => ({ mutateAsync: jest.fn() }),
}));
jest.mock('src/actions/auth/use-update-token', () => ({
  useUpdateToken: () => ({ mutateAsync: mockRefreshToken }),
}));

jest.mock('./utils', () => ({
  setSession: jest.fn(),
  getSession: () => mockGetSession(),
  purgeAuthSession: () => mockPurge(),
}));

jest.mock('../components/idle-timer', () => ({
  IdleTimer: (props: { timeout: number; onIdle: () => void }) => {
    mockIdleProps = props;
    return null;
  },
}));

jest.mock('../components/session-expired-dialog', () => ({
  SessionExpiredDialog: ({
    open,
    reason,
    onConfirm,
  }: {
    open: boolean;
    reason: string | null;
    onConfirm: () => void;
  }) =>
    open ? (
      <button type="button" data-testid="overlay" data-reason={reason ?? ''} onClick={onConfirm}>
        go
      </button>
    ) : null,
}));

function renderProvider() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div>app</div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe('AuthProvider session management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIdleProps = null;
    mockUnauthorizedHandler = null;
    mockGetSession.mockReturnValue('token');
    mockUseTokenLifetime.mockReturnValue({ data: null });
    mockUseCurrentUser.mockReturnValue({ data: { id: '1', firstname: 'Ana' }, isLoading: false });
  });

  describe('idle timeout derivation from token lifetime', () => {
    it('uses the backend lifetime (hours -> ms) when provided', () => {
      mockUseTokenLifetime.mockReturnValue({ data: 2 });
      renderProvider();
      expect(mockIdleProps).not.toBeNull();
      expect(mockIdleProps!.timeout).toBe(2 * 60 * 60 * 1000);
    });

    it('falls back to the CONFIG value when lifetime is null', () => {
      mockUseTokenLifetime.mockReturnValue({ data: null });
      renderProvider();
      expect(mockIdleProps).not.toBeNull();
      expect(mockIdleProps!.timeout).toBe(CONFIG.auth.inactivityTimeout * 60 * 1000);
    });

    it('does not mount the idle timer when lifetime is 0 (never expires)', () => {
      mockUseTokenLifetime.mockReturnValue({ data: 0 });
      renderProvider();
      expect(mockIdleProps).toBeNull();
    });

    it('does not mount the idle timer when not authenticated', () => {
      mockUseTokenLifetime.mockReturnValue({ data: 2 });
      mockUseCurrentUser.mockReturnValue({ data: null, isLoading: false });
      renderProvider();
      expect(mockIdleProps).toBeNull();
    });
  });

  describe('forced session end', () => {
    it('purges, clears the auth header and shows the idle overlay on inactivity', () => {
      mockUseTokenLifetime.mockReturnValue({ data: 1 });
      renderProvider();

      act(() => {
        mockIdleProps!.onIdle();
      });

      expect(mockPurge).toHaveBeenCalledTimes(1);
      expect(mockSetHeader).toHaveBeenCalledWith('Authorization', '');

      const overlay = screen.getByTestId('overlay');
      expect(overlay).toHaveAttribute('data-reason', 'idle');

      fireEvent.click(overlay);
      expect(mockReplace).toHaveBeenCalledWith(paths.auth.signIn);
    });

    it('shows the unauthorized overlay when a 401 arrives with an active session', () => {
      renderProvider();
      expect(mockUnauthorizedHandler).not.toBeNull();

      act(() => {
        mockUnauthorizedHandler!();
      });

      expect(mockPurge).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('overlay')).toHaveAttribute('data-reason', 'unauthorized');
    });

    it('ignores a 401 when there is no active session (avoids loops)', () => {
      mockGetSession.mockReturnValue(null);
      renderProvider();

      act(() => {
        mockUnauthorizedHandler!();
      });

      expect(mockPurge).not.toHaveBeenCalled();
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    it('auto-redirects to sign-in after the delay', () => {
      jest.useFakeTimers();
      try {
        mockUseTokenLifetime.mockReturnValue({ data: 1 });
        renderProvider();

        act(() => {
          mockIdleProps!.onIdle();
        });

        expect(mockReplace).not.toHaveBeenCalled();

        act(() => {
          jest.advanceTimersByTime(4000);
        });

        expect(mockReplace).toHaveBeenCalledWith(paths.auth.signIn);
      } finally {
        jest.useRealTimers();
      }
    });
  });

  describe('token refresh scheduling', () => {
    it('refreshes the token before the real lifetime expires', () => {
      jest.useFakeTimers();
      try {
        mockUseTokenLifetime.mockReturnValue({ data: 2 });
        renderProvider();

        act(() => {
          jest.advanceTimersByTime(2 * MS_PER_HOUR * TOKEN_REFRESH_RATIO);
        });

        expect(mockRefreshToken).toHaveBeenCalledTimes(1);
      } finally {
        jest.useRealTimers();
      }
    });

    it('does not schedule a refresh when the token never expires (0)', () => {
      jest.useFakeTimers();
      try {
        mockUseTokenLifetime.mockReturnValue({ data: 0 });
        renderProvider();

        act(() => {
          jest.advanceTimersByTime(100 * MS_PER_HOUR);
        });

        expect(mockRefreshToken).not.toHaveBeenCalled();
      } finally {
        jest.useRealTimers();
      }
    });

    it('falls back to the CONFIG refresh time when lifetime is null', () => {
      jest.useFakeTimers();
      try {
        mockUseTokenLifetime.mockReturnValue({ data: null });
        renderProvider();

        act(() => {
          jest.advanceTimersByTime(CONFIG.auth.tokenExpirationTime * 60 * 1000);
        });

        expect(mockRefreshToken).toHaveBeenCalledTimes(1);
      } finally {
        jest.useRealTimers();
      }
    });
  });
});
