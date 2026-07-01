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

jest.mock('./graphql/mutations/delete-template', () => ({
  DELETE_TEMPLATE: 'DELETE_TEMPLATE',
}));

import { useDeleteTemplate } from './use-delete-template';

const mockGraphql = { request: jest.fn() };
const mockQueryClient = { invalidateQueries: jest.fn() };

describe('useDeleteTemplate', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockUseQueryClient.mockReturnValue(mockQueryClient);
    mockUseMutation.mockReturnValue({ mutate: jest.fn(), mutateAsync: jest.fn(), isPending: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns mutation result', () => {
    const { result } = renderHook(() => useDeleteTemplate());
    expect(typeof result.current.mutate).toBe('function');
  });

  it('uses correct mutationKey', () => {
    renderHook(() => useDeleteTemplate());
    const opts = mockUseMutation.mock.calls[0][0];
    expect(opts.mutationKey).toEqual(['chatTemplate', 'delete']);
  });

  it('onSuccess calls options.onSuccess and invalidates query', async () => {
    const onSuccess = jest.fn();
    const response = { message: 'deleted', success: true };
    let capturedOnSuccess: any;
    mockUseMutation.mockImplementation((opts: any) => {
      capturedOnSuccess = opts.onSuccess;
      return { mutate: jest.fn(), mutateAsync: jest.fn() };
    });
    renderHook(() => useDeleteTemplate({ onSuccess }));
    await capturedOnSuccess(response);
    expect(onSuccess).toHaveBeenCalledWith(response);
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['getTemplatesList'] });
  });

  it('onError calls options.onError', () => {
    const onError = jest.fn();
    const err = new Error('delete error');
    let capturedOnError: any;
    mockUseMutation.mockImplementation((opts: any) => {
      capturedOnError = opts.onError;
      return { mutate: jest.fn(), mutateAsync: jest.fn() };
    });
    renderHook(() => useDeleteTemplate({ onError }));
    capturedOnError(err);
    expect(onError).toHaveBeenCalledWith(err);
  });

  it('does not throw when no options provided', async () => {
    const response = { message: 'ok', success: true };
    let capturedOnSuccess: any;
    let capturedOnError: any;
    mockUseMutation.mockImplementation((opts: any) => {
      capturedOnSuccess = opts.onSuccess;
      capturedOnError = opts.onError;
      return { mutate: jest.fn(), mutateAsync: jest.fn() };
    });
    renderHook(() => useDeleteTemplate());
    await expect(capturedOnSuccess(response)).resolves.not.toThrow();
    expect(() => capturedOnError(new Error('x'))).not.toThrow();
  });
});
