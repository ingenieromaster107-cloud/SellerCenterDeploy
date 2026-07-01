jest.mock('src/auth/context', () => ({
  getSession: jest.fn(() => null),
}));

jest.mock('graphql-request', () => {
  const mockClient = {
    request: jest.fn().mockResolvedValue({ data: 'ok' }),
    setHeader: jest.fn(),
  };
  return {
    GraphQLClient: jest.fn(() => mockClient),
  };
});

describe('GraphQLService', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.VITE_ENV = 'test';
    process.env.VITE_BACKEND_GRAPHQL_URL = 'http://test-graphql.com';
  });

  it('getInstance returns a GraphQLService instance', async () => {
    const { GraphQLService } = await import('./graphql-client');
    // Reset singleton for tests
    (GraphQLService as any).instance = undefined;
    const instance = GraphQLService.getInstance();
    expect(instance).toBeDefined();
  });

  it('getInstance returns the same instance (singleton)', async () => {
    const { GraphQLService } = await import('./graphql-client');
    (GraphQLService as any).instance = undefined;
    const a = GraphQLService.getInstance();
    const b = GraphQLService.getInstance();
    expect(a).toBe(b);
  });

  it('setHeader calls the underlying client setHeader', async () => {
    const { GraphQLService } = await import('./graphql-client');
    (GraphQLService as any).instance = undefined;
    const instance = GraphQLService.getInstance();
    expect(() => instance.setHeader('Authorization', 'Bearer test')).not.toThrow();
  });

  it('request calls the underlying client request', async () => {
    const { GraphQLService } = await import('./graphql-client');
    (GraphQLService as any).instance = undefined;
    const instance = GraphQLService.getInstance();
    const result = await instance.request('query { test }');
    expect(result).toBeDefined();
  });

  it('invokes the unauthorized handler and rethrows on HTTP 401', async () => {
    const { GraphQLService } = await import('./graphql-client');
    (GraphQLService as any).instance = undefined;
    const { GraphQLClient } = await import('graphql-request');

    const instance = GraphQLService.getInstance();
    const client = (GraphQLClient as unknown as jest.Mock).mock.results.at(-1)!.value;
    const error = { response: { status: 401 } };
    client.request.mockRejectedValueOnce(error);

    const handler = jest.fn();
    instance.setUnauthorizedHandler(handler);

    await expect(instance.request('query { test }')).rejects.toBe(error);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('invokes the unauthorized handler on a graphql-authorization error', async () => {
    const { GraphQLService } = await import('./graphql-client');
    (GraphQLService as any).instance = undefined;
    const { GraphQLClient } = await import('graphql-request');

    const instance = GraphQLService.getInstance();
    const client = (GraphQLClient as unknown as jest.Mock).mock.results.at(-1)!.value;
    client.request.mockRejectedValueOnce({
      response: { errors: [{ extensions: { category: 'graphql-authorization' } }] },
    });

    const handler = jest.fn();
    instance.setUnauthorizedHandler(handler);

    await expect(instance.request('query { test }')).rejects.toBeDefined();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the unauthorized handler on other errors', async () => {
    const { GraphQLService } = await import('./graphql-client');
    (GraphQLService as any).instance = undefined;
    const { GraphQLClient } = await import('graphql-request');

    const instance = GraphQLService.getInstance();
    const client = (GraphQLClient as unknown as jest.Mock).mock.results.at(-1)!.value;
    client.request.mockRejectedValueOnce({ response: { status: 500 } });

    const handler = jest.fn();
    instance.setUnauthorizedHandler(handler);

    await expect(instance.request('query { test }')).rejects.toBeDefined();
    expect(handler).not.toHaveBeenCalled();
  });
});
