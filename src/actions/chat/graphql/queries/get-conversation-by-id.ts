import { gql } from 'graphql-request';

export const GET_CONVERSATION_BY_ID = gql`
  query InterConversationMessages($conversationId: Int!) {
    interConversationMessages(conversationId: $conversationId) {
      total_count
      items {
        entity_id
        product_context_id
        author_type
        content
        was_moderated
        created_at
      }
    }
  }
`;
