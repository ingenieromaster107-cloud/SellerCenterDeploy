import type { ChatMessage } from 'src/interfaces/chat/chat';
import type { ConversationListResponse } from 'src/interfaces/chat/conversation-list';

function inferContentType(content: string): ChatMessage['contentType'] {
  const trimmed = content.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return 'image';
  }

  return 'text';
}

export function mapConversationToChatMessages(data?: ConversationListResponse): ChatMessage[] {
  const items = data?.wolfsellersConversationMessages?.items ?? [];

  return items.map((item) => {
    const body = item.content ?? '';

    return {
      id: String(item.entity_id),
      body,
      senderId: item.author_type || 'unknown',
      contentType: inferContentType(body),
      createdAt: item.created_at,
      attachments: [],
    };
  });
}
