import type { ChatParticipant } from 'src/interfaces/chat/chat';
import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';

import { useCallback } from 'react';
import { Link } from 'react-router';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';  

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { ChatHeaderSkeleton } from './chat-skeleton';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  participants: ChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  productId?: string;
};

export function ChatHeaderDetails({ collapseNav, participants, loading, productId }: Props) {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const {translate:t}= useTranslate();

  const singleParticipant = participants[0];


  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    
  }, [lgUp, onCollapseDesktop, onOpenMobile]);


  const renderSingle = () => (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
      <Badge variant={singleParticipant?.isClosed === 'OPEN' ? 'online' : 'busy'} badgeContent=" ">
        <Avatar src={singleParticipant?.avatarUrl} alt={singleParticipant?.name} />
      </Badge>

      <ListItemText
        primary={singleParticipant?.name}
        secondary={
          singleParticipant?.isClosed === 'OPEN'
            ? t('chatModule.chatRoom.chatStatus.open')
            : t('chatModule.chatRoom.chatStatus.closed')
        }
      />
    </Box>
  );

  if (loading) {
    return <ChatHeaderSkeleton />;
  }


  return (
    <>
      {renderSingle()}

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>
        {productId && (
          <Link target='_blank' to={`/product/${productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button>
            {t('chatModule.headerProduct.redirectToProduct')}
          </Button>
          </Link>
        )}
        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={!collapseDesktop ? 'custom:sidebar-unfold-fill' : 'custom:sidebar-fold-fill'}
          />
        </IconButton>
      </Box>
    </>
  );
}
