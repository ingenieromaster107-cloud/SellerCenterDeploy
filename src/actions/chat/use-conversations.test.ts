import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQuery: (...args: any[]) => mockUseQuery(...args),
}));

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: { getInstance: () => mockGetInstance() },
}));

jest.mock('./graphql/queries/get-conversation-by-id', () => ({
  GET_CONVERSATION_BY_ID: 'GET_CONVERSATION_BY_ID',
}));

jest.mock('./adapters/conversation-messages-adapter', () => ({
  mapConversationToChatMessages: (data: any, id: any) =>
    data ? [{ id: 'msg1', conversationId: id }] : [],
}));

import { useGetSellerConversationsById } from './use-conversations';

const mockGraphql = { request: jest.fn() };

describe('useGetSellerConversationsById', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty messages when no conversationId', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useGetSellerConversationsById(undefined));
    expect(result.current.messages).toEqual([]);
  });

  it('returns empty messages when conversationId is "0"', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useGetSellerConversationsById('0'));
    expect(result.current.messages).toEqual([]);
  });

  it('returns messages when valid conversationId and data', () => {
    const raw = { conversationMessages: [] };
    mockUseQuery.mockReturnValue({ data: raw, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useGetSellerConversationsById('42'));
    expect(result.current.messages).toEqual([{ id: 'msg1', conversationId: '42' }]);
    expect(result.current.data).toBe(raw);
  });

  it('passes enabled:false to useQuery when no conversationId', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
    renderHook(() => useGetSellerConversationsById(undefined));
    const queryOpts = mockUseQuery.mock.calls[0][0];
    expect(queryOpts.enabled).toBe(false);
  });

  it('passes enabled:true to useQuery with valid conversationId', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
    renderHook(() => useGetSellerConversationsById('99'));
    const queryOpts = mockUseQuery.mock.calls[0][0];
    expect(queryOpts.enabled).toBe(true);
  });

  it('returns isLoading and isError flags', () => {
    const err = new Error('fail');
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: true, error: err });
    const { result } = renderHook(() => useGetSellerConversationsById('5'));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(err);
  });
});
