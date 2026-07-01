import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatNav } from './chat-nav';

jest.mock('src/routes/paths', () => ({
  paths: { chat: { root: '/chat' } },
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div data-testid="scrollbar">{children}</div>,
}));

jest.mock('./styles', () => ({
  ToggleButton: ({ children, onClick }: any) => (
    <button data-testid="toggle-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('./chat-nav-item', () => ({
  ChatNavItem: ({ conversation }: any) => (
    <li data-testid="chat-nav-item">{conversation.id}</li>
  ),
}));

jest.mock('./chat-nav-account', () => ({
  ChatNavAccount: () => <div data-testid="chat-nav-account" />,
}));

jest.mock('./chat-skeleton', () => ({
  ChatNavItemSkeleton: () => <div data-testid="chat-nav-skeleton" />,
}));

jest.mock('./chat-nav-search-results', () => ({
  ChatNavSearchResults: ({ query }: any) => (
    <div data-testid="chat-nav-search-results">{query}</div>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const collapseNav = {
  collapseDesktop: false,
  onCollapseDesktop: jest.fn(),
  onCloseDesktop: jest.fn(),
  openMobile: false,
  onOpenMobile: jest.fn(),
  onCloseMobile: jest.fn(),
};

const contacts: any[] = [
  { id: '2', name: 'Bob', avatarUrl: null },
];

const conversations = {
  byId: {
    'conv-1': {
      id: 'conv-1',
      type: 'ONE_TO_ONE',
      participants: [],
      messages: [],
      unreadCount: 0,
    },
  },
  allIds: ['conv-1'],
};

describe('ChatNav', () => {
  it('renders conversation nav items when contacts exist', () => {
    renderWithTheme(
      <ChatNav
        loading={false}
        contacts={contacts}
        collapseNav={collapseNav}
        conversations={conversations as any}
        selectedConversationId=""
      />
    );
    expect(screen.getAllByTestId('chat-nav-item').length).toBe(1);
  });

  it('renders loading skeleton when loading', () => {
    renderWithTheme(
      <ChatNav
        loading
        contacts={contacts}
        collapseNav={collapseNav}
        conversations={{ byId: {}, allIds: [] } as any}
        selectedConversationId=""
      />
    );
    expect(screen.getByTestId('chat-nav-skeleton')).toBeInTheDocument();
  });

  it('shows empty state message when no contacts and not loading', () => {
    renderWithTheme(
      <ChatNav
        loading={false}
        contacts={[]}
        collapseNav={collapseNav}
        conversations={{ byId: {}, allIds: [] } as any}
        selectedConversationId=""
      />
    );
    expect(
      screen.getByText('chatModule.sideBar.contacts.errors.notConversations.title')
    ).toBeInTheDocument();
  });

  it('renders toggle button for mobile', () => {
    renderWithTheme(
      <ChatNav
        loading={false}
        contacts={[]}
        collapseNav={collapseNav}
        conversations={{ byId: {}, allIds: [] } as any}
        selectedConversationId=""
      />
    );
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });
});
