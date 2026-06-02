import type { ChatMessage, ChatParticipant } from 'src/interfaces/chat/chat';

// ----------------------------------------------------------------------

type Props = {
  currentUserId: string;
  message: ChatMessage;
  participants: ChatParticipant[];
};

export function getMessage({ message, participants, currentUserId }: Props) {
  const SELLER_ID = 'SELLER';
  
  const sender = participants.find((participant) => participant.id === currentUserId);

  const isCurrentUser = message.procedence ===  SELLER_ID;

  const senderDetails = message.procedence ===  SELLER_ID
    ? { type: 'me' }
    : { avatarUrl: sender?.name, firstName: ` ${sender?.name ?? 'Unknown'}` };

  const hasImage = message.contentType === 'image';

  return { hasImage, me: isCurrentUser, senderDetails };
}
