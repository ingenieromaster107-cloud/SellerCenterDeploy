import type { BoxProps } from '@mui/material/Box';
import type { TemplatesResponse } from 'src/interfaces';
import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import type { ChatParticipant, ChatConversation } from 'src/interfaces/chat/chat';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatRoomSkeleton } from './chat-skeleton';
import { ChatRoomSingle } from './chat-room-single';
import { ChatRoomTemplates } from './chat-room-templates';
import { ChatRoomAttachments } from './chat-room-attachments';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const NAV_DRAWER_WIDTH = 320;

type Props = BoxProps & {
  loading: boolean;
  participants: ChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  messages: ChatConversation['messages'];
  onSelectTemplate?: (content: string) => void;
  currentConversationId?: string;
};

export function ChatRoom({
  collapseNav,
  participants,
  messages,
  loading,
  onSelectTemplate,
  currentConversationId,
  sx,
  ...other
}: Props) {
  const templates: TemplatesResponse[] = 
    [
      {
        content: 'Hola bienvenido, estamos en black days',
        created_at: '2026-05-27 20:28:28',
        entity_id: 2,
        is_active: true,
        seller_id: 1,
        sort_order: 0,
        title: 'Saludo black days',
        updated_at: '2026-05-27 20:28:28',
      },
      {
        content: 'Hola espero estés muy bien',
        created_at: '2026-05-27 20:08:07',
        entity_id: 1,
        is_active: true,    
        seller_id: 1,
        sort_order: 0,
        title: 'saludo inicial',
        updated_at: '2026-05-27 20:27:27',
      },
    ];
  const { collapseDesktop, openMobile, onCloseMobile } = collapseNav;

  const participantFilter = participants.find((participant) => participant.id === currentConversationId);


  const attachments = messages.map((msg) => msg.attachments).flat(1) || [];

  const renderContent = () =>
    loading ? (
      <ChatRoomSkeleton />
    ) : (
      <Scrollbar>
        <div>
          <ChatRoomSingle participant={participantFilter!} />
          <ChatRoomAttachments attachments={attachments} />
          <ChatRoomTemplates templates={templates} onSelectTemplate={onSelectTemplate} />
        </div>
      </Scrollbar>
    );

  return (
    <>
      <Box
        sx={[
          (theme) => ({
            minHeight: 0,
            flex: '1 1 auto',
            width: NAV_WIDTH,
            flexDirection: 'column',
            display: { xs: 'none', lg: 'flex' },
            borderLeft: `solid 1px ${theme.vars.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(collapseDesktop && { width: 0 }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {!collapseDesktop && renderContent()}
      </Box>

      <Drawer
        anchor="right"
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: NAV_DRAWER_WIDTH } },
        }}
      >
        {renderContent()}
      </Drawer>
    </>
  );
}
