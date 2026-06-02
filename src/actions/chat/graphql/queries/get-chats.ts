import { gql } from 'graphql-request';

export const GET_CHATS = gql`
  query {
    interMyConversations(as: SELLER, pageSize: 20, currentPage: 1) {
      total_count
      items {
        entity_id
        buyer_id
        status
        last_message_at
      }
    }
  }
`;
