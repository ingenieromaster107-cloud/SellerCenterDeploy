'use client';

import type { PropsWithChildren } from 'react';
import type { AuthStatus } from './auth-context';
import type { SessionExpiredReason } from '../components/session-expired-dialog';

import { useQueryClient } from '@tanstack/react-query';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useLogin } from 'src/actions/auth/use-login';
import { useLogout } from 'src/actions/auth/use-logout';
import { GraphQLService } from 'src/lib/graphql-client';
import { useCurrentUser } from 'src/actions/auth/use-current-user';
import { useUpdateToken } from 'src/actions/auth/use-update-token';
import { useTokenLifetime } from 'src/actions/auth/use-token-lifetime';

import { AuthContext } from './auth-context';
import { IdleTimer } from '../components/idle-timer';
import { getSession, setSession, purgeAuthSession } from './utils';
import { SessionExpiredDialog } from '../components/session-expired-dialog';
import { MS_PER_HOUR, REDIRECT_DELAY_MS, TOKEN_REFRESH_RATIO } from './constant';

// ----------------------------------------------------------------------

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { mutateAsync: refreshToken } = useUpdateToken();
  const { data: user, isLoading } = useCurrentUser();
  const { data: tokenLifetimeHours } = useTokenLifetime();
  const graphql = GraphQLService.getInstance();
  const [expiredReason, setExpiredReason] = useState<SessionExpiredReason | null>(null);
  const isEndingSessionRef = useRef(false);

  const authStatus: AuthStatus = isLoading
    ? 'checking'
    : user
      ? 'authenticated'
      : 'not-authenticated';

  const idleTimeoutMs =
    tokenLifetimeHours == null
      ? CONFIG.auth.inactivityTimeout * 60 * 1000
      : tokenLifetimeHours * MS_PER_HOUR;

  const isIdleLogoutEnabled = authStatus === 'authenticated' && idleTimeoutMs > 0;

  const refreshDelayMs =
    tokenLifetimeHours == null
      ? CONFIG.auth.tokenExpirationTime * 60 * 1000
      : tokenLifetimeHours <= 0
        ? 0
        : tokenLifetimeHours * MS_PER_HOUR * TOKEN_REFRESH_RATIO;

  const handleLogin = useCallback(
    async (credentials: { email: string; password: string }) => {
      await loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  const handleLogout = useCallback(async () => {
    await logoutMutation.mutateAsync(undefined, {
      onSettled: () => {
        queryClient.clear();
      },
    });
  }, [logoutMutation, queryClient]);

  const checkUserSession = useCallback(() => {
    if (authStatus === 'not-authenticated') {
      setSession(null);
    }
  }, [authStatus]);

  useEffect(() => {
    checkUserSession();
  }, [authStatus, checkUserSession]);

  useEffect(() => {
    if (authStatus !== 'authenticated' || refreshDelayMs <= 0) return undefined;

    const timeoutId = setTimeout(() => {
      refreshToken();
    }, refreshDelayMs);

    return () => clearTimeout(timeoutId);
  }, [authStatus, refreshToken, refreshDelayMs]);

  const forceSessionEnd = useCallback(
    (reason: SessionExpiredReason) => {
      if (isEndingSessionRef.current) return;
      isEndingSessionRef.current = true;

      purgeAuthSession();
      graphql.setHeader('Authorization', '');
      queryClient.clear();
      setExpiredReason(reason);
    },
    [graphql, queryClient]
  );

  const goToSignIn = useCallback(() => {
    setExpiredReason(null);
    isEndingSessionRef.current = false;
    router.replace(paths.auth.signIn);
  }, [router]);

  const handleIdle = useCallback(() => forceSessionEnd('idle'), [forceSessionEnd]);

  useEffect(() => {
    graphql.setUnauthorizedHandler(() => {
      if (!getSession()) return;
      forceSessionEnd('unauthorized');
    });

    return () => graphql.setUnauthorizedHandler(null);
  }, [graphql, forceSessionEnd]);

  useEffect(() => {
    if (!expiredReason) return undefined;

    const timeoutId = setTimeout(goToSignIn, REDIRECT_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [expiredReason, goToSignIn]);

  const memoizedValue = useMemo(
    () => ({
      user,
      authStatus,
      loading: authStatus === 'checking',
      authenticated: authStatus === 'authenticated',
      unauthenticated: authStatus === 'not-authenticated',

      login: handleLogin,
      logout: handleLogout,
    }),
    [authStatus, handleLogin, handleLogout, user]
  );

  return (
    <AuthContext value={memoizedValue}>
      {children}
      {isIdleLogoutEnabled && <IdleTimer timeout={idleTimeoutMs} onIdle={handleIdle} />}
      {expiredReason && <SessionExpiredDialog open reason={expiredReason} onConfirm={goToSignIn} />}
    </AuthContext>
  );
}
