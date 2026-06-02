import type { ConversationListResponse } from 'src/interfaces/chat/conversation-list';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_CONVERSATION_BY_ID } from './graphql/queries/get-conversation-by-id';
import { mapConversationToChatMessages } from './adapters/conversation-messages-adapter';

const CONVERSATION_POLLING_INTERVAL_MS = 10000;

export function useGetSellerConversationsById(conversationId?: string) {
  const graphql = GraphQLService.getInstance();
  const isConversationEnabled = !!conversationId && conversationId !== '0';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getConversations', conversationId],
    enabled: isConversationEnabled,
    refetchInterval: isConversationEnabled ? CONVERSATION_POLLING_INTERVAL_MS : false,
    refetchIntervalInBackground: true,
    queryFn: async () =>
      graphql.request<ConversationListResponse, { conversationId: string }>(
        GET_CONVERSATION_BY_ID,
        { conversationId: conversationId!.toString() }
      ),
  });

  const messages = useMemo(
    () => (isConversationEnabled ? mapConversationToChatMessages(data, conversationId) : []),
    [data, conversationId, isConversationEnabled]
  );

  return { data, messages, isLoading, isError, error };
}
