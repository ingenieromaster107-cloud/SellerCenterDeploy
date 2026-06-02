import { gql } from 'graphql-request';

export const REPLY_MESSAGE = gql`
  mutation InterSendMessage(
    $conversationId: Int!
    $message: String!
  ) {
    interSendMessage(
      input: { conversation_id: $conversationId, as: SELLER, content: $message }
    ) {
      entity_id
      author_type
      content
      created_at
    }
  }
`;
