import type { ChatConversation } from 'src/interfaces/chat/chat';

import { getNavItem } from './get-nav-item';

const baseParticipant = {
  id: 'user-1',
  name: 'Alice',
  status: 'offline' as const,
  lastActivity: '2024-01-01T10:00:00Z',
  role: 'member',
  email: 'alice@example.com',
  phoneNumber: '',
  address: '',
  avatarUrl: '',
};

const currentUserId = 'current-user';

const currentUserParticipant = {
  ...baseParticipant,
  id: currentUserId,
  name: 'Me',
  status: 'online' as const,
};

function buildConversation(overrides: Partial<ChatConversation> = {}): ChatConversation {
  return {
    id: 'conv-1',
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [],
    participants: [currentUserParticipant, { ...baseParticipant, id: 'user-1', name: 'Alice' }],
    ...overrides,
  } as unknown as ChatConversation;
}

describe('getNavItem', () => {
  it('returns displayName as joined names of participants excluding currentUserId', () => {
    const conversation = buildConversation({
      participants: [
        currentUserParticipant,
        { ...baseParticipant, id: 'user-1', name: 'Alice' },
        { ...baseParticipant, id: 'user-2', name: 'Bob' },
      ],
    });

    const result = getNavItem({ currentUserId, conversation });

    expect(result.displayName).toBe('Alice, Bob');
  });

  it('excludes currentUserId from participants list', () => {
    const conversation = buildConversation();

    const result = getNavItem({ currentUserId, conversation });

    expect(result.participants.every(p => p.id !== currentUserId)).toBe(true);
  });

  it('sets group=true when there are more than 1 participant besides currentUser', () => {
    const conversation = buildConversation({
      participants: [
        currentUserParticipant,
        { ...baseParticipant, id: 'user-1', name: 'Alice' },
        { ...baseParticipant, id: 'user-2', name: 'Bob' },
      ],
    });

    const result = getNavItem({ currentUserId, conversation });

    expect(result.group).toBe(true);
  });

  it('sets group=false when there is only 1 participant besides currentUser', () => {
    const conversation = buildConversation({
      participants: [
        currentUserParticipant,
        { ...baseParticipant, id: 'user-1', name: 'Alice' },
      ],
    });

    const result = getNavItem({ currentUserId, conversation });

    expect(result.group).toBe(false);
  });

  it('displays last message body in displayText', () => {
    const conversation = buildConversation({
      messages: [
        {
          id: 'msg-1',
          senderId: 'user-1',
          contentType: 'text',
          body: 'Hello there!',
          createdAt: '2024-01-01T10:00:00Z',
          attachments: [],
        },
      ],
    } as any);

    const result = getNavItem({ currentUserId, conversation });

    expect(result.displayText).toBe('Hello there!');
  });

  it('prefixes displayText with "You: " when senderId matches currentUserId', () => {
    const conversation = buildConversation({
      messages: [
        {
          id: 'msg-1',
          senderId: currentUserId,
          contentType: 'text',
          body: 'Hi from me!',
          createdAt: '2024-01-01T10:00:00Z',
          attachments: [],
        },
      ],
    } as any);

    const result = getNavItem({ currentUserId, conversation });

    expect(result.displayText).toBe('You: Hi from me!');
  });

  it('shows "Sent a photo" when last message contentType is "image"', () => {
    const conversation = buildConversation({
      messages: [
        {
          id: 'msg-1',
          senderId: 'user-1',
          contentType: 'image',
          body: '',
          createdAt: '2024-01-01T10:00:00Z',
          attachments: [],
        },
      ],
    } as any);

    const result = getNavItem({ currentUserId, conversation });

    expect(result.displayText).toBe('Sent a photo');
  });

  it('prefixes "Sent a photo" with "You: " when image is sent by currentUser', () => {
    const conversation = buildConversation({
      messages: [
        {
          id: 'msg-1',
          senderId: currentUserId,
          contentType: 'image',
          body: '',
          createdAt: '2024-01-01T10:00:00Z',
          attachments: [],
        },
      ],
    } as any);

    const result = getNavItem({ currentUserId, conversation });

    expect(result.displayText).toBe('You: Sent a photo');
  });

  it('sets hasOnlineInGroup=true when group and at least one participant is online', () => {
    const conversation = buildConversation({
      participants: [
        currentUserParticipant,
        { ...baseParticipant, id: 'user-1', name: 'Alice', status: 'offline' },
        { ...baseParticipant, id: 'user-2', name: 'Bob', status: 'online' },
      ],
    });

    const result = getNavItem({ currentUserId, conversation });

    expect(result.hasOnlineInGroup).toBe(true);
  });

  it('sets hasOnlineInGroup=false when group and no participant is online', () => {
    const conversation = buildConversation({
      participants: [
        currentUserParticipant,
        { ...baseParticipant, id: 'user-1', name: 'Alice', status: 'offline' },
        { ...baseParticipant, id: 'user-2', name: 'Bob', status: 'offline' },
      ],
    });

    const result = getNavItem({ currentUserId, conversation });

    expect(result.hasOnlineInGroup).toBe(false);
  });

  it('sets hasOnlineInGroup=false for one-to-one conversations regardless of status', () => {
    const conversation = buildConversation({
      participants: [
        currentUserParticipant,
        { ...baseParticipant, id: 'user-1', name: 'Alice', status: 'online' },
      ],
    });

    const result = getNavItem({ currentUserId, conversation });

    expect(result.hasOnlineInGroup).toBe(false);
  });

  it('returns empty displayText when there are no messages', () => {
    const conversation = buildConversation({ messages: [] });

    const result = getNavItem({ currentUserId, conversation });

    expect(result.displayText).toBe('');
  });

  it('returns lastActivity from last message createdAt when messages exist', () => {
    const createdAt = '2024-06-15T12:30:00Z';
    const conversation = buildConversation({
      messages: [
        {
          id: 'msg-1',
          senderId: 'user-1',
          contentType: 'text',
          body: 'Hey',
          createdAt,
          attachments: [],
        },
      ],
    } as any);

    const result = getNavItem({ currentUserId, conversation });

    expect(result.lastActivity).toBe(createdAt);
  });

  it('falls back to participant lastActivity when there are no messages', () => {
    const lastActivity = '2024-05-01T08:00:00Z';
    const conversation = buildConversation({
      messages: [],
      participants: [
        currentUserParticipant,
        { ...baseParticipant, id: 'user-1', name: 'Alice', lastActivity },
      ],
    });

    const result = getNavItem({ currentUserId, conversation });

    expect(result.lastActivity).toBe(lastActivity);
  });
});
