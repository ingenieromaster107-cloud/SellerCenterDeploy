import type { ChatParticipant } from 'src/interfaces/chat/chat';

import { useState, useEffect, useCallback, startTransition } from 'react';

import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetConversation } from 'src/actions/chat/chat';
import { useGetChatList } from 'src/actions/chat/use-chat-list';
import { useGetSellerConversationsById } from 'src/actions/chat/use-conversations';

import { EmptyContent } from 'src/components/empty-content';

import { useMockedUser, useAuthContext } from 'src/auth/hooks';

import { ChatNav } from './chat-nav';
import { ChatLayout } from './layout';
import { ChatRoom } from './chat-room';
import { ChatMessageList } from './chat-message-list';
import { ChatMessageInput } from './chat-message-input';
import { ChatHeaderDetails } from './chat-header-details';
import { ChatHeaderCompose } from './chat-header-compose';
import { useCollapseNav } from './hooks/use-collapse-nav';

// ----------------------------------------------------------------------

export function ChatView() {
  const router = useRouter();
  const { translate } = useTranslate();

  const {
    data: sellerChatConversations,
    contacts: sellerChatContacts,
    isLoading: sellerChatsLoading,
  } = useGetChatList();
  
  const { user: userData } = useAuthContext();
  const customerFormatted: ChatParticipant[] = [];
  customerFormatted.push({
    id: userData?.identificationNumber?.value ?? '',
    address: userData?.address?.city ?? '',
    avatarUrl: userData?.firstname ?? '',
    email: userData?.email ?? '',
    lastActivity: '',
    name: userData?.firstname ?? '',
    phoneNumber: '',
    role: 'customer',
    status: 'online',
  });
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get('id') || '';

  const { conversation, conversationError, conversationLoading } =
    useGetConversation(selectedConversationId);

  const  { messages} =useGetSellerConversationsById(Number(selectedConversationId));
  

  const roomNav = useCollapseNav();
  const conversationsNav = useCollapseNav();

  const [recipients, setRecipients] = useState<ChatParticipant[]>([]);

  useEffect(() => {
    if (!selectedConversationId) {
      startTransition(() => {
        router.push(paths.chat.root);
      });
    }
  }, [conversationError, router, selectedConversationId]);

  const handleAddRecipients = useCallback((selected: ChatParticipant[]) => {
    setRecipients(selected);
  }, []);

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
    >
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {translate('chatModule.title')}
      </Typography>

      <ChatLayout
        slots={{
          // Header changes based on whether a conversation is selected or not
          header: selectedConversationId ? (
            <ChatHeaderDetails
              collapseNav={roomNav}
              participants={sellerChatConversations.byId[selectedConversationId]?.participants ?? []}
              loading={conversationLoading}
            />
          ) : (
            <ChatHeaderCompose
              contacts={sellerChatContacts}
              onAddRecipients={handleAddRecipients}
            />
          ),
          nav: (
            <ChatNav
              contacts={sellerChatContacts}
              conversations={sellerChatConversations}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
              loading={sellerChatsLoading}
            />
          ),
          main: (
            <>
              {selectedConversationId ? (
                conversationError ? (
                  <EmptyContent
                    title={conversationError.message}
                    imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-empty.svg`}
                  />
                ) : (
                  <ChatMessageList
                    messages={messages}
                    participants={sellerChatContacts}
                    loading={conversationLoading}
                  />
                )
              ) : (
                <EmptyContent
                  title="Good morning!"
                  description="Write something awesome..."
                  imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                />
              )}

              <ChatMessageInput
                recipients={recipients}
                onAddRecipients={handleAddRecipients}
                selectedConversationId={selectedConversationId}
                disabled={!recipients.length && !selectedConversationId}
              />
            </>
          ),
          details: conversation && selectedConversationId && (
            <ChatRoom
              collapseNav={roomNav}
              participants={sellerChatContacts}
              loading={conversationLoading}
              messages={conversation?.messages ?? []}
            />
          ),
        }}
      />
    </DashboardContent>
  );
}
