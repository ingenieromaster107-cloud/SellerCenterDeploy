import { renderHook } from '@testing-library/react';

const mockUseMutation = jest.fn();
const mockUseQueryClient = jest.fn();
const mockGetInstance = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useMutation: (...args: any[]) => mockUseMutation(...args),
  useQueryClient: () => mockUseQueryClient(),
}));

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: { getInstance: () => mockGetInstance() },
}));

jest.mock('./graphql/mutations/create-template', () => ({
  CREATE_TEMPLATE: 'CREATE_TEMPLATE',
}));

import { useCreateTemplate } from './use-create-template';

const mockGraphql = { request: jest.fn() };
const mockQueryClient = { invalidateQueries: jest.fn() };

describe('useCreateTemplate', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockUseQueryClient.mockReturnValue(mockQueryClient);
    mockUseMutation.mockReturnValue({ mutate: jest.fn(), mutateAsync: jest.fn(), isPending: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns mutation result', () => {
    const { result } = renderHook(() => useCreateTemplate());
    expect(typeof result.current.mutate).toBe('function');
  });

  it('uses correct mutationKey', () => {
    renderHook(() => useCreateTemplate());
    const opts = mockUseMutation.mock.calls[0][0];
    expect(opts.mutationKey).toEqual(['chatTemplate', 'create']);
  });

  it('onSuccess calls options.onSuccess and invalidates query', async () => {
    const onSuccess = jest.fn();
    const template = { entity_id: 1, title: 'New', content: 'Body', is_active: 1 };
    let capturedOnSuccess: any;
    mockUseMutation.mockImplementation((opts: any) => {
      capturedOnSuccess = opts.onSuccess;
      return { mutate: jest.fn(), mutateAsync: jest.fn() };
    });
    renderHook(() => useCreateTemplate({ onSuccess }));
    await capturedOnSuccess(template);
    expect(onSuccess).toHaveBeenCalledWith(template);
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['getTemplatesList'] });
  });

  it('onError calls options.onError', () => {
    const onError = jest.fn();
    const err = new Error('failed');
    let capturedOnError: any;
    mockUseMutation.mockImplementation((opts: any) => {
      capturedOnError = opts.onError;
      return { mutate: jest.fn(), mutateAsync: jest.fn() };
    });
    renderHook(() => useCreateTemplate({ onError }));
    capturedOnError(err);
    expect(onError).toHaveBeenCalledWith(err);
  });

  it('does not throw when no options callbacks provided', async () => {
    const template = { entity_id: 2, title: 'T', content: 'C', is_active: 1 };
    let capturedOnSuccess: any;
    let capturedOnError: any;
    mockUseMutation.mockImplementation((opts: any) => {
      capturedOnSuccess = opts.onSuccess;
      capturedOnError = opts.onError;
      return { mutate: jest.fn(), mutateAsync: jest.fn() };
    });
    renderHook(() => useCreateTemplate());
    await expect(capturedOnSuccess(template)).resolves.not.toThrow();
    expect(() => capturedOnError(new Error('x'))).not.toThrow();
  });
});
