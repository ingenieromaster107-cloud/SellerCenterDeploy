import { useState, useEffect, useCallback, startTransition } from 'react';

import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetChatList } from 'src/actions/chat/use-chat-list';
import { useGetSellerConversationsById } from 'src/actions/chat/use-conversations';

import { EmptyContent } from 'src/components/empty-content';

import { ChatNav } from './chat-nav';
import { ChatLayout } from './layout';
import { ChatRoom } from './chat-room';
import { ChatMessageList } from './chat-message-list';
import { ChatMessageInput } from './chat-message-input';
import { ChatHeaderDetails } from './chat-header-details';
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
  
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get('id') || '';
  const selectedConversationNumericId = Number(selectedConversationId);
  const conversationId =
     selectedConversationNumericId > 0
      ? selectedConversationNumericId
      : undefined;

  const { messages, error, isLoading: conversationLoading } = useGetSellerConversationsById(
    conversationId?.toString()
  );
  
  const roomNav = useCollapseNav();
  const conversationsNav = useCollapseNav();
  const [messageDraft, setMessageDraft] = useState('');

  useEffect(() => {
    if (!selectedConversationId) {
      startTransition(() => {
        router.push(paths.chat.root);
      });
    }
  }, [ router, selectedConversationId]);

  const filterToGetProduct = messages.find((message) =>(message.productId));

  const handleSelectTemplate = useCallback((content: string) => {
    setMessageDraft(content);
  }, []);

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      className="chat-view"
    >
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {translate('chatModule.title')}
      </Typography>

      <ChatLayout
        slots={{
          // Header changes based on whether a conversation is selected or not
          header: selectedConversationId && (
            <ChatHeaderDetails
              collapseNav={roomNav}
              participants={sellerChatConversations.byId[selectedConversationId]?.participants ?? []}
              loading={sellerChatsLoading}
              productId={filterToGetProduct?.productId}
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
                error ? (
                  <EmptyContent
                    title={error.message}
                    imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-empty.svg`}
                  />
                ) : (
                  <ChatMessageList
                    messages={messages}
                    loading={conversationLoading}
                    participants={sellerChatContacts}
                    currentConversationId={selectedConversationId}
                  />
                )
              ) : (
                <EmptyContent
                  title={translate('chatModule.emptyContent.title')}
                  description={translate('chatModule.emptyContent.description')}
                  imgUrl={`${CONFIG.assetsDir}/assets/images/logo/logo-small.svg`}
                />
              )}

              <ChatMessageInput
                message={messageDraft}
                onMessageChange={setMessageDraft}
                selectedConversationId={selectedConversationId}
                disabled={!selectedConversationId || conversationLoading}
              />
            </>
          ),
          details: sellerChatConversations && selectedConversationId && (
            <ChatRoom
              collapseNav={roomNav}
              participants={sellerChatContacts}
              loading={conversationLoading}
              messages={messages}
              onSelectTemplate={handleSelectTemplate}
              currentConversationId={selectedConversationId}
            />
          ),
        }}
      />
    </DashboardContent>
  );
}
