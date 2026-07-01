import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQuery: (...args: any[]) => mockUseQuery(...args),
}));

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: { getInstance: () => mockGetInstance() },
}));

jest.mock('./graphql/queries/get-chats', () => ({ GET_CHATS: 'GET_CHATS' }));

jest.mock('./adapters/chats-adapter', () => ({
  mapChatListToConversations: (data: any) => (data ? [{ id: 'c1' }] : []),
  mapChatListToContacts: (data: any) => (data ? [{ id: 'contact1' }] : []),
}));

import { useGetChatList } from './use-chat-list';

const mockGraphql = { request: jest.fn() };

describe('useGetChatList', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty conversations when no data', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useGetChatList());
    expect(result.current.data).toEqual([]);
    expect(result.current.contacts).toEqual([]);
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false, error: null });
    const { result } = renderHook(() => useGetChatList());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError flag', () => {
    const err = new Error('network');
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true, error: err });
    const { result } = renderHook(() => useGetChatList());
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(err);
  });

  it('maps data to conversations and contacts when data is present', () => {
    const raw = { messageThread: [] };
    mockUseQuery.mockReturnValue({ data: raw, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useGetChatList());
    expect(result.current.data).toEqual([{ id: 'c1' }]);
    expect(result.current.contacts).toEqual([{ id: 'contact1' }]);
    expect(result.current.rawData).toBe(raw);
  });
});
