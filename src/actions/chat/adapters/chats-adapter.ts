import type { ConversationListResponse } from 'src/interfaces/chat/conversation-list';
import type { ChatListResponse, Item as ChatListItem } from 'src/interfaces/chat/chat-list';
import type { ChatParticipant, ChatConversation, ChatConversations } from 'src/interfaces/chat/chat';

export function mapChatListToContacts(data?: ChatListResponse): ChatParticipant[] {
	const items = data?.wolfsellersMyConversations?.items ?? [];

	const contactsById = items.reduce<Record<string, ChatParticipant>>((acc, item) => {
		const buyerId = String(item.buyer_id);

		if (!acc[buyerId]) {
			acc[buyerId] = {
				id: buyerId,
				name: `User ${buyerId}`,
				email: buyerId,
				avatarUrl: buyerId,
				address: '',
				lastActivity: item.last_message_at,
				phoneNumber: buyerId,
				role: 'buyer',
				status: item.status === 'offline' ? 'offline' : 'online',
			};
		}

		return acc;
	}, {});

	return Object.values(contactsById);
}

export function mapChatListToConversations(data?: ChatListResponse): ChatConversations {
	const items = data?.wolfsellersMyConversations?.items ?? [];

	const byId = items.reduce<Record<string, ChatConversation>>((acc, item: ChatListItem) => {
		const conversationId = String(item.entity_id);
		const buyerId = String(item.buyer_id);

		acc[conversationId] = {
			id: conversationId,
			type: 'direct',
			unreadCount: 0,
			messages: [
				{
					id: `${conversationId}-1`,
					body: '',
					senderId: buyerId,
					contentType: 'text',
					createdAt: item.last_message_at,
					attachments: [],
				},
			],
			participants: [
				{
					id: buyerId,
					name: `User ${buyerId}`,
					role: 'buyer',
					email: buyerId,
					address: '',
					avatarUrl: buyerId,
					phoneNumber: buyerId,
					lastActivity: item.last_message_at,
					status: item.status === 'offline' ? 'offline' : 'online',
				},
			],
		};

		return acc;
	}, {});

	return {
		allIds: Object.keys(byId),
		byId,
	};
}

export function chatAdapter(data?: ConversationListResponse): ChatConversations {
	const items = data?.wolfsellersConversationMessages?.items ?? [];

	const byId = items.reduce<Record<string, ChatConversation>>((acc, item) => {
		const id = String(item.entity_id);

		if (!acc[id]) {
			acc[id] = {
				id,
				type: 'direct',
				unreadCount: 0,
				messages: [],
				participants: [
					{
						id,
						name: `User ${id}`,
						role: item.author_type || 'buyer',
						email: '',
						address: '',
						avatarUrl: '',
						phoneNumber: '',
						lastActivity: item.created_at,
						status: 'online',
					},
				],
			};
		}

		acc[id].messages.push({
			id: `${id}-${acc[id].messages.length + 1}`,
			body: item.content || '',
			senderId: id,
			contentType: 'text',
			createdAt: item.created_at,
			attachments: [],
		});

		return acc;
	}, {});

	return {
		allIds: Object.keys(byId),
		byId,
	};
}