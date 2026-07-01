import { mapConversationToChatMessages } from './conversation-messages-adapter';

describe('mapConversationToChatMessages', () => {
  it('returns [] for undefined data', () => {
    const result = mapConversationToChatMessages(undefined, 'conv-1');
    expect(result).toEqual([]);
  });

  it('returns [] when interConversationMessages is missing', () => {
    const result = mapConversationToChatMessages({} as any, 'conv-1');
    expect(result).toEqual([]);
  });

  it('maps items to ChatMessage format', () => {
    const data = {
      interConversationMessages: {
        items: [
          {
            entity_id: 42,
            content: 'Hello world',
            created_at: '2024-01-01T00:00:00Z',
            author_type: 'SELLER',
            product_context_id: 99,
          },
        ],
      },
    } as any;

    const result = mapConversationToChatMessages(data, 'conv-abc');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: '42',
      body: 'Hello world',
      senderId: 'conv-abc',
      contentType: 'text',
      createdAt: '2024-01-01T00:00:00Z',
      attachments: [],
      procedence: 'SELLER',
      productId: '99',
    });
  });

  it('sets contentType to image when body starts with https://', () => {
    const data = {
      interConversationMessages: {
        items: [
          {
            entity_id: 1,
            content: 'https://example.com/image.png',
            created_at: '2024-01-01T00:00:00Z',
            author_type: 'BUYER',
            product_context_id: 10,
          },
        ],
      },
    } as any;

    const result = mapConversationToChatMessages(data, 'conv-1');

    expect(result[0].contentType).toBe('image');
  });

  it('sets contentType to image when body starts with http://', () => {
    const data = {
      interConversationMessages: {
        items: [
          {
            entity_id: 2,
            content: 'http://example.com/image.jpg',
            created_at: '2024-01-01T00:00:00Z',
            author_type: 'BUYER',
            product_context_id: 11,
          },
        ],
      },
    } as any;

    const result = mapConversationToChatMessages(data, 'conv-2');

    expect(result[0].contentType).toBe('image');
  });

  it('sets contentType to text for plain text body', () => {
    const data = {
      interConversationMessages: {
        items: [
          {
            entity_id: 3,
            content: 'Just a regular message',
            created_at: '2024-01-01T00:00:00Z',
            author_type: 'SELLER',
            product_context_id: 12,
          },
        ],
      },
    } as any;

    const result = mapConversationToChatMessages(data, 'conv-3');

    expect(result[0].contentType).toBe('text');
  });

  it('uses conversationId as senderId when provided', () => {
    const data = {
      interConversationMessages: {
        items: [
          {
            entity_id: 5,
            content: 'msg',
            created_at: '2024-01-01T00:00:00Z',
            author_type: 'SELLER',
            product_context_id: 1,
          },
        ],
      },
    } as any;

    const result = mapConversationToChatMessages(data, 'my-conv-id');

    expect(result[0].senderId).toBe('my-conv-id');
  });

  it('uses unknown as senderId when conversationId is not provided', () => {
    const data = {
      interConversationMessages: {
        items: [
          {
            entity_id: 6,
            content: 'msg',
            created_at: '2024-01-01T00:00:00Z',
            author_type: 'BUYER',
            product_context_id: 2,
          },
        ],
      },
    } as any;

    const result = mapConversationToChatMessages(data);

    expect(result[0].senderId).toBe('unknown');
  });

  it('uses unknown as senderId when conversationId is an empty string', () => {
    const data = {
      interConversationMessages: {
        items: [
          {
            entity_id: 7,
            content: 'msg',
            created_at: '2024-01-01T00:00:00Z',
            author_type: 'BUYER',
            product_context_id: 3,
          },
        ],
      },
    } as any;

    const result = mapConversationToChatMessages(data, '');

    expect(result[0].senderId).toBe('unknown');
  });

  it('falls back to empty string when item content is null', () => {
    const data = {
      interConversationMessages: {
        items: [
          {
            entity_id: 8,
            content: null,
            created_at: '2024-01-01T00:00:00Z',
            author_type: 'SELLER',
            product_context_id: 4,
          },
        ],
      },
    } as any;

    const result = mapConversationToChatMessages(data, 'conv-8');

    expect(result[0].body).toBe('');
    expect(result[0].contentType).toBe('text');
  });
});
