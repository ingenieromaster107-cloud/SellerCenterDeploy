
import { useRef, useState, useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';

import { useTranslate } from 'src/locales';
import { useReplyConversation } from 'src/actions/chat/use-reply-conversation';




// ----------------------------------------------------------------------

type Props = {
  disabled: boolean;
  message: string;
  selectedConversationId: string;
  onMessageChange: (value: string) => void;
};

export function ChatMessageInput({
  disabled,
  message,
  onMessageChange,
  selectedConversationId,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<number | undefined>(undefined);
  const { translate: t } = useTranslate();

  const { mutateAsync: replyConversation, isError, isPending } = useReplyConversation();
  const [showError, setShowError] = useState(false);
  const [disabledControl,setDisabledControl] = useState(false);
  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onMessageChange(event.target.value);
  }, [onMessageChange]);

  const sendMessage = useCallback(async () => {

    if (!message.trim()) {
      return;
    }

    try {
      if (selectedConversationId) {
        // If the conversation already exists
        await replyConversation({ conversationId: selectedConversationId, message });
        onMessageChange('');
        setDisabledControl(false);
      }
    } catch (error) {
      console.error(error);
      setShowError(true);
      if (errorTimerRef.current) {
        window.clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = window.setTimeout(() => {
        setShowError(false);
        setDisabledControl(false);
      }, 4000);
    }
  }, [message, onMessageChange, selectedConversationId, replyConversation]);

  const handleSendMessage = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') {
        return;
      }
      setDisabledControl(true);
      await sendMessage();
      setDisabledControl(false);

      
    },
    [sendMessage]
  );

  const handleSendClick = useCallback(async () => {
    await sendMessage();
  }, [sendMessage]);

  return (
    <>
      {isError && showError && (
        <Alert
          severity="error"
          onClose={() => {
            if (errorTimerRef.current) {
              window.clearTimeout(errorTimerRef.current);
            }
            setShowError(false);
          }}
        >
          {t('chatModule.messageInput.errors.sending')}
        </Alert>
      )}
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder={t('chatModule.messageInput.placeholder')}
        disabled={disabled || disabledControl || isPending}
        endAdornment={
          <Button onClick={handleSendClick} disabled={disabled || !message.trim() || isPending}>
            {isPending ? t('chatModule.messageInput.sending') : t('chatModule.messageInput.sendButton')}
          </Button>
        }
        sx={[
          (theme) => ({
            px: 1,
            height: 56,
            flexShrink: 0,
            borderTop: `solid 1px ${theme.vars.palette.divider}`,
          }),
        ]}
        />
        
      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}
