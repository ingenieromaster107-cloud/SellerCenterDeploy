import { gql } from 'graphql-request';

export const GET_CONVERSATIONS = gql`
  query {
    wolfsellersConversationMessages(conversationId: 2) {
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
