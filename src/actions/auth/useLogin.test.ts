import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useLogin } from './useLogin';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({
      request: mockRequest,
      setHeader: jest.fn(),
    }),
  },
}));

jest.mock('src/auth/context/utils', () => ({
  getSession: jest.fn(() => 'test-token'),
  setSession: jest.fn(),
}));

jest.mock('./graphql', () => ({
  LOGIN_MUTATION: 'LOGIN_MUTATION',
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useLogin', () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  it('returns a mutate function', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    expect(typeof result.current.mutate).toBe('function');
  });

  it('calls graphql.request on mutate', async () => {
    mockRequest.mockResolvedValue({ generateCustomerToken: { token: 'abc123' } });
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: 'user@test.com', password: 'pass' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalledWith('LOGIN_MUTATION', {
      email: 'user@test.com',
      password: 'pass',
    });
  });

  it('sets isError on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Login failed'));
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: 'user@test.com', password: 'wrong' });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
