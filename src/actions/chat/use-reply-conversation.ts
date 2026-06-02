import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { REPLY_MESSAGE } from './graphql/mutations';

export interface UseReplyConversationParams {
  conversationId: string;
  message: string;
}
export interface ReplyMessageResponse {
  entity_id: number;
  author_type: string;
  content: string;
  created_at: any;
}

export function useReplyConversation() {
  const graphql = GraphQLService.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['chat', 'reply-message'],
    mutationFn: (params: UseReplyConversationParams) =>
      graphql.request<ReplyMessageResponse, UseReplyConversationParams>(REPLY_MESSAGE, params),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['getConversations', Number(variables.conversationId)],
      });

      await queryClient.invalidateQueries({ queryKey: ['getChats'] });
    },
  });
}

