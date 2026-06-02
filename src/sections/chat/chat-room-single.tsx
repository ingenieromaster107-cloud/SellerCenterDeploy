import type { ChatParticipant } from 'src/interfaces/chat/chat';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';


// ----------------------------------------------------------------------

type Props = {
  participant: ChatParticipant;
};

export function ChatRoomSingle({ participant }: Props) {
  const { translate:t } = useTranslate();
  const renderInfo = () => (
    <Stack alignItems="center" sx={{ py: 5 }}>
      <Avatar
        alt={participant?.name}
        src={participant?.avatarUrl}
        sx={{ width: 96, height: 96, mb: 2 }}
      />
      <Typography variant="subtitle1">{participant?.name}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        {participant?.role}
      </Typography>
      <Typography variant="body2" color={participant?.isClosed === 'CLOSED' ? 'error.main' : 'success.main'}>
        {participant?.isClosed === 'CLOSED' ? t('chatModule.chatRoom.chatStatus.closed') : t('chatModule.chatRoom.chatStatus.open')}
      </Typography>
    </Stack>
  );

  return (
    <>
      {renderInfo()}

    </>
  );
}
