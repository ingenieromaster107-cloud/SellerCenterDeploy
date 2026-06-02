import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import type { ChatParticipant, ChatConversations } from 'src/interfaces/chat/chat';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ToggleButton } from './styles';
import { ChatNavItem } from './chat-nav-item';
import { ChatNavAccount } from './chat-nav-account';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { ChatNavSearchResults } from './chat-nav-search-results';

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;
const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  loading: boolean;
  selectedConversationId: string;
  contacts: ChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  conversations: ChatConversations;
};

export function ChatNav({
  loading,
  contacts,
  collapseNav,
  conversations,
  selectedConversationId,
}: Props) {
  const router = useRouter();
  const { translate } = useTranslate();

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
    onCollapseDesktop,
  } = collapseNav;


  const [searchContacts, setSearchContacts] = useState<{
    query: string;
    results: ChatParticipant[];
  }>({ query: '', results: [] });
  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (mdUp) {
      onCollapseDesktop();
    } else {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile, onCollapseDesktop]);

  const handleClickCompose = useCallback(() => {
    if (!mdUp) {
      onCloseMobile();
    }
    router.push(paths.chat.root);
  }, [mdUp, onCloseMobile, router]);

  const handleSearchContacts = useCallback(
    (inputValue: string) => {
      setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));

      if (inputValue) {
        const results = contacts.filter((contact) =>
          contact.name.toLowerCase().includes(inputValue.toLowerCase())
        );

        setSearchContacts((prevState) => ({ ...prevState, results }));
      }
    },
    [contacts]
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: '', results: [] });
  }, []);

  const handleClickResult = useCallback(
    async (result: ChatParticipant) => {
      handleClickAwaySearch();

      const linkTo = (id: string) => router.push(`${paths.chat.root}?id=${id}`);

      try {
        // Check if the conversation already exists
        if (conversations.allIds.includes(result.id)) {
          linkTo(result.id);
          return;
        }

        // Find the recipient in contacts
        const recipient = contacts.find((contact) => contact.id === result.id);
        if (!recipient) {
          console.error('Recipient not found');
          return;
        }

        // Navigate to the new conversation
        
      } catch (error) {
        console.error('Error handling click result:', error);
      }
    },
    [contacts, conversations.allIds, handleClickAwaySearch, router]
  );

  const renderLoading = () => <ChatNavItemSkeleton />;

  const renderList = () => (
    <nav>
      <Box component="ul">
        {conversations.allIds.map((conversationId) => (
          <ChatNavItem
            key={conversationId}
            collapse={collapseDesktop}
            conversation={conversations.byId[conversationId]}
            selected={conversationId === selectedConversationId}
            onCloseMobile={onCloseMobile}
          />
        ))}
      </Box>
    </nav>
  );

  const renderListResults = () => (
    <ChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={handleClickResult}
    />
  );

  //chat searcher
  
  const renderSearchInput = () => (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchContacts.query}
        onChange={(event) => handleSearchContacts(event.target.value)}
        placeholder={translate('chatModule.sideBar.contactsSearcher.placeholder')}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );

  const renderContent = () => (
    <>
      <Box
        sx={{
          pt: 2.5,
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!collapseDesktop && (
          <>
            <ChatNavAccount />
            <Box sx={{ flexGrow: 1 }} />
          </>
        )}

        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={collapseDesktop ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
          />
        </IconButton>

        {!collapseDesktop && (
          <IconButton onClick={handleClickCompose}>
            <Iconify width={24} icon="solar:user-plus-bold" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ p: 2.5, pt: 0 }}>{!collapseDesktop && renderSearchInput()}</Box>

      {loading ? (
        renderLoading()
      ) : contacts.length === 0 && collapseDesktop != true ? (
        <Box sx={{ padding: 2.5, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
              {translate('chatModule.sideBar.contacts.errors.notConversations.title')}
          </Typography>
           {translate('chatModule.sideBar.contacts.errors.notConversations.description')}
        </Box>
      ) : (
        <Scrollbar sx={{ pb: 1 }}>
          {searchContacts.query && !!conversations.allIds.length
            ? renderListResults()
              : renderList()}
          </Scrollbar>
      )}
    </>
  );

  return (
    <>
      <ToggleButton onClick={onOpenMobile} sx={{ display: { md: 'none' } }}>
        <Iconify width={16} icon="solar:users-group-rounded-bold" />
      </ToggleButton>

      <Box
        sx={[
          (theme) => ({
            minHeight: 0,
            flex: '1 1 auto',
            width: NAV_WIDTH,
            flexDirection: 'column',
            display: { xs: 'none', md: 'flex' },
            borderRight: `solid 1px ${theme.vars.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(collapseDesktop && { width: NAV_COLLAPSE_WIDTH }),
          }),
        ]}
      >
        {renderContent()}
      </Box>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: NAV_WIDTH } },
        }}
      >
        {renderContent()}
      </Drawer>
    </>
  );
}
