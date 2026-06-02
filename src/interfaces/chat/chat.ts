import type { BadgeProps } from '@mui/material/Badge';
import type { DateValue } from './common';

// ----------------------------------------------------------------------

export type ChatAttachment = {
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  createdAt: DateValue;
  modifiedAt: DateValue;
};

export type ChatMessage = {
  id: string;
  productId?: string;
  body: string;
  senderId: string;
  contentType: string;
  createdAt: DateValue;
  attachments: ChatAttachment[];
  procedence?: string;
};

export type ChatParticipant = {
  id: string;
  name: string;
  role: string;
  email: string;
  address: string;
  avatarUrl: string;
  phoneNumber: string;
  lastActivity: DateValue;
  status: BadgeProps['variant'];
  isClosed?: string;
};

export type ChatConversation = {
  id: string;
  type: string;
  unreadCount: number;
  messages: ChatMessage[];
  participants: ChatParticipant[];
};

export type ChatConversations = {
  allIds: string[];
  byId: Record<string, ChatConversation>;
};
