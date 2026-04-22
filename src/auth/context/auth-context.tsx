'use client';

import type { Customer } from 'src/interfaces/customer/customer.interface';

import { createContext } from 'react';

// ----------------------------------------------------------------------

export type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

interface AuthContextProps {
  user: Customer | null | undefined;
  authStatus: AuthStatus;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;

  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
