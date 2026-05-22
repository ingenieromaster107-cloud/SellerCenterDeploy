import { gql } from 'graphql-request';

export const GET_CONVERSATION_BY_ID = gql`
  query WolfsellersConversationMessages($conversationId: Int!) {
    wolfsellersConversationMessages(conversationId: $conversationId) {
      total_count
      items {
        entity_id
        author_type
        content
        was_moderated
        created_at
      }
    }
  }
`;
