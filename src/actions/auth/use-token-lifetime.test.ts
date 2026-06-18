import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useTokenLifetime } from './use-token-lifetime';

const mockRequest = jest.fn();

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest }),
  },
}));

jest.mock('./graphql/query/store-config', () => ({
  GET_TOKEN_LIFETIME_QUERY: 'GET_TOKEN_LIFETIME_QUERY',
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useTokenLifetime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the token lifetime in hours from storeConfig', async () => {
    mockRequest.mockResolvedValue({
      storeConfig: { customer_access_token_lifetime: 1.5 },
    });

    const { result } = renderHook(() => useTokenLifetime(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(1.5);
  });

  it('preserves a 0 lifetime (never expires)', async () => {
    mockRequest.mockResolvedValue({
      storeConfig: { customer_access_token_lifetime: 0 },
    });

    const { result } = renderHook(() => useTokenLifetime(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(0);
  });

  it('returns null when the backend does not expose the value', async () => {
    mockRequest.mockResolvedValue({ storeConfig: {} });

    const { result } = renderHook(() => useTokenLifetime(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });
});
