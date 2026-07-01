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

jest.mock('./graphql/mutations/update-template', () => ({
  UPDATE_TEMPLATES_LIST: 'UPDATE_TEMPLATES_LIST',
}));

import { useUpdateTemplate } from './use-update-template';

const mockGraphql = { request: jest.fn() };
const mockQueryClient = { invalidateQueries: jest.fn() };

describe('useUpdateTemplate', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockUseQueryClient.mockReturnValue(mockQueryClient);
    mockUseMutation.mockReturnValue({ mutate: jest.fn(), mutateAsync: jest.fn(), isPending: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns mutation result', () => {
    const { result } = renderHook(() => useUpdateTemplate());
    expect(typeof result.current.mutate).toBe('function');
  });

  it('uses correct mutationKey', () => {
    renderHook(() => useUpdateTemplate());
    const opts = mockUseMutation.mock.calls[0][0];
    expect(opts.mutationKey).toEqual(['chatTemplate', 'update']);
  });

  it('onSuccess calls options.onSuccess and invalidates query', async () => {
    const onSuccess = jest.fn();
    const template = { entity_id: 3, title: 'Updated', content: 'New body', is_active: 0 };
    let capturedOnSuccess: any;
    mockUseMutation.mockImplementation((opts: any) => {
      capturedOnSuccess = opts.onSuccess;
      return { mutate: jest.fn(), mutateAsync: jest.fn() };
    });
    renderHook(() => useUpdateTemplate({ onSuccess }));
    await capturedOnSuccess(template);
    expect(onSuccess).toHaveBeenCalledWith(template);
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['getTemplatesList'] });
  });

  it('onError calls options.onError', () => {
    const onError = jest.fn();
    const err = new Error('update failed');
    let capturedOnError: any;
    mockUseMutation.mockImplementation((opts: any) => {
      capturedOnError = opts.onError;
      return { mutate: jest.fn(), mutateAsync: jest.fn() };
    });
    renderHook(() => useUpdateTemplate({ onError }));
    capturedOnError(err);
    expect(onError).toHaveBeenCalledWith(err);
  });

  it('does not throw when no options provided', async () => {
    const template = { entity_id: 1, title: 'T', content: 'C', is_active: 1 };
    let capturedOnSuccess: any;
    let capturedOnError: any;
    mockUseMutation.mockImplementation((opts: any) => {
      capturedOnSuccess = opts.onSuccess;
      capturedOnError = opts.onError;
      return { mutate: jest.fn(), mutateAsync: jest.fn() };
    });
    renderHook(() => useUpdateTemplate());
    await expect(capturedOnSuccess(template)).resolves.not.toThrow();
    expect(() => capturedOnError(new Error('x'))).not.toThrow();
  });
});
