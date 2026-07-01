import { chatAdapter, mapChatListToContacts, mapChatListToConversations } from './chats-adapter';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeChatListResponse(items: any[]): any {
  return { interMyConversations: { total_count: items.length, items } };
}

function makeConversationListResponse(items: any[]): any {
  return { interConversationMessages: { total_count: items.length, items } };
}

const CHAT_ITEM_BASE = {
  entity_id: 10,
  buyer_id: 20,
  status: 'online',
  last_message_at: '2024-01-01T00:00:00Z',
} as any;

const CONV_ITEM_BASE = {
  entity_id: 10,
  product_context_id: 1,
  author_type: 'buyer',
  content: 'Hello',
  was_moderated: false,
  created_at: '2024-01-01T00:00:00Z',
} as any;

// ---------------------------------------------------------------------------
// mapChatListToContacts
// ---------------------------------------------------------------------------

describe('mapChatListToContacts', () => {
  it('returns an empty array when data is undefined', () => {
    expect(mapChatListToContacts(undefined)).toEqual([]);
  });

  it('returns an empty array when items list is empty', () => {
    expect(mapChatListToContacts(makeChatListResponse([]))).toEqual([]);
  });

  it('returns a contact for each unique buyer_id', () => {
    const data = makeChatListResponse([
      { ...CHAT_ITEM_BASE, entity_id: 10, buyer_id: 20 },
      { ...CHAT_ITEM_BASE, entity_id: 11, buyer_id: 21 },
    ]);

    const result = mapChatListToContacts(data);

    expect(result).toHaveLength(2);
    const ids = result.map((c) => c.id);
    expect(ids).toContain('10');
    expect(ids).toContain('11');
  });

  it('maps fields correctly for a single item', () => {
    const item = { entity_id: 10, buyer_id: 20, status: 'online', last_message_at: '2024-01-01T00:00:00Z' } as any;
    const [contact] = mapChatListToContacts(makeChatListResponse([item]));

    expect(contact.id).toBe('10');
    expect(contact.name).toBe('User 20');
    expect(contact.email).toBe('20');
    expect(contact.avatarUrl).toBe('20');
    expect(contact.address).toBe('');
    expect(contact.lastActivity).toBe('2024-01-01T00:00:00Z');
    expect(contact.phoneNumber).toBe('20');
    expect(contact.role).toBe('buyer');
    expect(contact.isClosed).toBe('online');
  });

  it('deduplicates by buyer_id keeping the first occurrence', () => {
    const data = makeChatListResponse([
      { entity_id: 10, buyer_id: 20, status: 'online', last_message_at: '2024-01-01T00:00:00Z' },
      { entity_id: 99, buyer_id: 20, status: 'offline', last_message_at: '2024-06-01T00:00:00Z' },
    ]);

    const result = mapChatListToContacts(data);

    expect(result).toHaveLength(1);
    // First occurrence wins: entity_id=10 maps to id='10'
    expect(result[0].id).toBe('10');
    expect(result[0].status).toBe('online');
  });

  it('sets status to "offline" when item.status is "offline"', () => {
    const data = makeChatListResponse([
      { ...CHAT_ITEM_BASE, status: 'offline' },
    ]);

    const [contact] = mapChatListToContacts(data);
    expect(contact.status).toBe('offline');
  });

  it('sets status to "online" when item.status is anything other than "offline"', () => {
    for (const status of ['active', 'away', 'busy', '']) {
      const data = makeChatListResponse([{ ...CHAT_ITEM_BASE, status }]);
      const [contact] = mapChatListToContacts(data);
      expect(contact.status).toBe('online');
    }
  });
});

// ---------------------------------------------------------------------------
// mapChatListToConversations
// ---------------------------------------------------------------------------

describe('mapChatListToConversations', () => {
  it('returns empty structure when data is undefined', () => {
    const result = mapChatListToConversations(undefined);
    expect(result.allIds).toEqual([]);
    expect(result.byId).toEqual({});
  });

  it('returns empty structure when items list is empty', () => {
    const result = mapChatListToConversations(makeChatListResponse([]));
    expect(result.allIds).toEqual([]);
    expect(result.byId).toEqual({});
  });

  it('filters out items whose last_message_at is null', () => {
    const data = makeChatListResponse([
      { entity_id: 10, buyer_id: 20, status: 'online', last_message_at: null },
      { entity_id: 11, buyer_id: 21, status: 'online', last_message_at: '2024-01-01T00:00:00Z' },
    ]);

    const result = mapChatListToConversations(data);

    expect(result.allIds).toEqual(['11']);
    expect(result.byId['10']).toBeUndefined();
  });

  it('filters out items whose last_message_at is undefined', () => {
    const data = makeChatListResponse([
      { entity_id: 10, buyer_id: 20, status: 'online', last_message_at: undefined },
    ]);

    const result = mapChatListToConversations(data);
    expect(result.allIds).toHaveLength(0);
  });

  it('returns correct allIds for included items', () => {
    const data = makeChatListResponse([
      { entity_id: 10, buyer_id: 20, status: 'online', last_message_at: '2024-01-01T00:00:00Z' },
      { entity_id: 11, buyer_id: 21, status: 'offline', last_message_at: '2024-02-01T00:00:00Z' },
    ]);

    const result = mapChatListToConversations(data);

    expect(result.allIds).toHaveLength(2);
    expect(result.allIds).toContain('10');
    expect(result.allIds).toContain('11');
  });

  it('builds a conversation with correct shape for each item', () => {
    const item = { entity_id: 10, buyer_id: 20, status: 'online', last_message_at: '2024-01-01T00:00:00Z' } as any;
    const result = mapChatListToConversations(makeChatListResponse([item]));

    const conv = result.byId['10'];
    expect(conv).toBeDefined();
    expect(conv.id).toBe('10');
    expect(conv.type).toBe('direct');
    expect(conv.unreadCount).toBe(0);
    expect(conv.messages).toHaveLength(1);
    expect(conv.messages[0].id).toBe('10-1');
    expect(conv.messages[0].senderId).toBe('20');
    expect(conv.messages[0].createdAt).toBe('2024-01-01T00:00:00Z');
    expect(conv.participants).toHaveLength(1);
    expect(conv.participants[0].id).toBe('20');
    expect(conv.participants[0].status).toBe('online');
  });

  it('sets participant status to "offline" when item.status is "offline"', () => {
    const data = makeChatListResponse([
      { entity_id: 10, buyer_id: 20, status: 'offline', last_message_at: '2024-01-01T00:00:00Z' },
    ]);

    const result = mapChatListToConversations(data);
    expect(result.byId['10'].participants[0].status).toBe('offline');
  });
});

// ---------------------------------------------------------------------------
// chatAdapter
// ---------------------------------------------------------------------------

describe('chatAdapter', () => {
  it('returns empty structure when data is undefined', () => {
    const result = chatAdapter(undefined);
    expect(result.allIds).toEqual([]);
    expect(result.byId).toEqual({});
  });

  it('returns empty structure when items list is empty', () => {
    const result = chatAdapter(makeConversationListResponse([]));
    expect(result.allIds).toEqual([]);
    expect(result.byId).toEqual({});
  });

  it('creates one conversation entry per unique entity_id', () => {
    const data = makeConversationListResponse([
      { ...CONV_ITEM_BASE, entity_id: 10 },
      { ...CONV_ITEM_BASE, entity_id: 11 },
    ]);

    const result = chatAdapter(data);

    expect(result.allIds).toHaveLength(2);
    expect(result.allIds).toContain('10');
    expect(result.allIds).toContain('11');
  });

  it('groups multiple messages under the same entity_id', () => {
    const data = makeConversationListResponse([
      { ...CONV_ITEM_BASE, entity_id: 10, content: 'First' },
      { ...CONV_ITEM_BASE, entity_id: 10, content: 'Second' },
      { ...CONV_ITEM_BASE, entity_id: 10, content: 'Third' },
    ]);

    const result = chatAdapter(data);

    expect(result.allIds).toHaveLength(1);
    expect(result.byId['10'].messages).toHaveLength(3);
  });

  it('accumulates messages per conversation with sequential ids', () => {
    const data = makeConversationListResponse([
      { ...CONV_ITEM_BASE, entity_id: 10, content: 'Msg A', created_at: '2024-01-01T00:00:00Z' },
      { ...CONV_ITEM_BASE, entity_id: 10, content: 'Msg B', created_at: '2024-01-02T00:00:00Z' },
    ]);

    const { byId } = chatAdapter(data);
    const msgs = byId['10'].messages;

    expect(msgs[0].id).toBe('10-1');
    expect(msgs[0].body).toBe('Msg A');
    expect(msgs[1].id).toBe('10-2');
    expect(msgs[1].body).toBe('Msg B');
  });

  it('builds a participant from the first item of each entity_id', () => {
    const data = makeConversationListResponse([
      { ...CONV_ITEM_BASE, entity_id: 10, author_type: 'seller' },
    ]);

    const { byId } = chatAdapter(data);
    const [participant] = byId['10'].participants;

    expect(participant.id).toBe('10');
    expect(participant.name).toBe('User 10');
    expect(participant.role).toBe('seller');
    expect(participant.status).toBe('online');
  });

  it('falls back to "buyer" role when author_type is falsy', () => {
    const data = makeConversationListResponse([
      { ...CONV_ITEM_BASE, entity_id: 10, author_type: '' },
    ]);

    const { byId } = chatAdapter(data);
    expect(byId['10'].participants[0].role).toBe('buyer');
  });

  it('uses empty string for message body when content is falsy', () => {
    const data = makeConversationListResponse([
      { ...CONV_ITEM_BASE, entity_id: 10, content: '' },
    ]);

    const { byId } = chatAdapter(data);
    expect(byId['10'].messages[0].body).toBe('');
  });

  it('handles multiple distinct entity_ids independently', () => {
    const data = makeConversationListResponse([
      { ...CONV_ITEM_BASE, entity_id: 1, content: 'A1' },
      { ...CONV_ITEM_BASE, entity_id: 2, content: 'B1' },
      { ...CONV_ITEM_BASE, entity_id: 1, content: 'A2' },
      { ...CONV_ITEM_BASE, entity_id: 2, content: 'B2' },
    ]);

    const { byId } = chatAdapter(data);

    expect(byId['1'].messages).toHaveLength(2);
    expect(byId['2'].messages).toHaveLength(2);
    expect(byId['1'].messages.map((m) => m.body)).toEqual(['A1', 'A2']);
    expect(byId['2'].messages.map((m) => m.body)).toEqual(['B1', 'B2']);
  });
});
