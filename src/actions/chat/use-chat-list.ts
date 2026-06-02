import type { ChatListResponse } from 'src/interfaces/chat/chat-list';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_CHATS } from './graphql/queries/get-chats';
import { mapChatListToContacts, mapChatListToConversations } from './adapters/chats-adapter';

const CHAT_LIST_POLLING_INTERVAL_MS = 10000;

export function useGetChatList() {
  const graphql = GraphQLService.getInstance();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getChats'],
    refetchInterval: CHAT_LIST_POLLING_INTERVAL_MS,
    refetchIntervalInBackground: true,
    queryFn: () => graphql.request<ChatListResponse>(GET_CHATS),
  });

  const conversations = useMemo(() => mapChatListToConversations(data), [data]);
  const contacts = useMemo(() => mapChatListToContacts(data), [data]);

  return { data: conversations, contacts, rawData: data, isLoading, isError, error };
}
