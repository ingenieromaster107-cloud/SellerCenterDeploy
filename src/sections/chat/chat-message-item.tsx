import type { ChatMessage, ChatParticipant } from 'src/interfaces/chat/chat';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';
import { getMessage } from 'src/utils/get-message';

import { useMockedUser } from 'src/auth/hooks';


// ----------------------------------------------------------------------

type Props = {
  message: ChatMessage;
  participants: ChatParticipant[];
  onOpenLightbox: (value: string) => void;
  currentConversationId?: string;
};

export function ChatMessageItem({ message, participants, onOpenLightbox, currentConversationId }: Props) {
  
  const { user } = useMockedUser();  
  const { me, senderDetails, hasImage } = getMessage({
    message,
    participants,
    currentUserId: currentConversationId ?? `${user?.id}`,
  });

  const { firstName, avatarUrl } = senderDetails;

  const { body, createdAt } = message;

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
    >
      {!me && `${firstName}, `}

      {fToNow(createdAt)}
    </Typography>
  );

  const renderBody = () => (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
        ...(hasImage && { p: 0, bgcolor: 'transparent' }),
      }}
    >
      {hasImage ? (
        <Box
          component="img"
          alt="Attachment"
          src={body}
          onClick={() => onOpenLightbox(body)}
          sx={{
            width: 400,
            height: 'auto',
            borderRadius: 1.5,
            cursor: 'pointer',
            objectFit: 'cover',
            aspectRatio: '16/11',
            '&:hover': { opacity: 0.9 },
          }}
        />
      ) : (
        body
      )}
    </Stack>
  );


  if (!message.body) {
    return null;
  }

  return (
    <Box sx={{ mb: 5, display: 'flex', justifyContent: me ? 'flex-end' : 'unset' }}>
      {!me && <Avatar alt={firstName?.split(' ')[1]} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack alignItems={me ? 'flex-end' : 'flex-start'}>
        {renderInfo()}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover': { '& .message-actions': { opacity: 1 } },
          }}
        >
          {renderBody()}
        </Box>
      </Stack>
    </Box>
  );
}
