import type { ConversationListResponse } from 'src/interfaces/chat/conversation-list';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_CONVERSATION_BY_ID } from './graphql/queries/get-conversation-by-id';
import { mapConversationToChatMessages } from './adapters/conversation-messages-adapter';

export function useGetSellerConversationsById(conversationId: number) {
  const graphql = GraphQLService.getInstance();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getConversations', conversationId],
    queryFn: async () =>
      graphql.request<ConversationListResponse, { conversationId: number }>(
        GET_CONVERSATION_BY_ID,
        { conversationId }
      ),
  });

  const messages = useMemo(() => mapConversationToChatMessages(data), [data]);

  return { data, messages, isLoading, isError, error };
}
