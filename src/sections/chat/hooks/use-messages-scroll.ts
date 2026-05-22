import type { ChatMessage } from 'src/interfaces/chat/chat';

import { useRef, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export type UseMessagesScrollReturn = {
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export function useMessagesScroll(messages: ChatMessage[]): UseMessagesScrollReturn {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (!messages) {
      return;
    }

    if (!messagesEndRef.current) {
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return { messagesEndRef };
}
