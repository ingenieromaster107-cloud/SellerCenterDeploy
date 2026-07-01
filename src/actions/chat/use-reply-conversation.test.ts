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

jest.mock('./graphql/mutations', () => ({ REPLY_MESSAGE: 'REPLY_MESSAGE' }));

import { useReplyConversation } from './use-reply-conversation';

const mockGraphql = { request: jest.fn() };
const mockQueryClient = { invalidateQueries: jest.fn() };

describe('useReplyConversation', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockUseQueryClient.mockReturnValue(mockQueryClient);
    mockUseMutation.mockReturnValue({ mutate: jest.fn(), mutateAsync: jest.fn(), isLoading: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns mutation object with mutate and mutateAsync', () => {
    const { result } = renderHook(() => useReplyConversation());
    expect(typeof result.current.mutate).toBe('function');
    expect(typeof result.current.mutateAsync).toBe('function');
  });

  it('passes correct mutationKey to useMutation', () => {
    renderHook(() => useReplyConversation());
    const opts = mockUseMutation.mock.calls[0][0];
    expect(opts.mutationKey).toEqual(['chat', 'reply-message']);
  });

  it('onSuccess invalidates getConversations and getChats queries', async () => {
    let capturedOnSuccess: any;
    mockUseMutation.mockImplementation((opts: any) => {
      capturedOnSuccess = opts.onSuccess;
      return { mutate: jest.fn(), mutateAsync: jest.fn() };
    });
    renderHook(() => useReplyConversation());
    await capturedOnSuccess({ entity_id: 1 }, { conversationId: '10', message: 'hi' });
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['getConversations', 10],
    });
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['getChats'],
    });
  });
});
