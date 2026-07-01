import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatView } from './chat-view';

jest.mock('src/routes/paths', () => ({
  paths: { chat: { root: '/chat' } },
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: () => '' }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

jest.mock('src/layouts/dashboard', () => ({
  DashboardContent: ({ children }: any) => <div data-testid="dashboard-content">{children}</div>,
}));

jest.mock('src/actions/chat/use-chat-list', () => ({
  useGetChatList: () => ({
    data: undefined,
    contacts: [],
    isLoading: false,
    conversations: { byId: {}, allIds: [] },
  }),
}));

jest.mock('src/actions/chat/use-conversations', () => ({
  useGetSellerConversationsById: () => ({
    messages: [],
    error: null,
    isLoading: false,
  }),
}));

jest.mock('src/components/empty-content', () => ({
  EmptyContent: ({ title }: any) => <div data-testid="empty-content">{title}</div>,
}));

jest.mock('./chat-nav', () => ({
  ChatNav: () => <div data-testid="chat-nav" />,
}));

jest.mock('./layout', () => ({
  ChatLayout: ({ slots }: any) => (
    <div data-testid="chat-layout">
      <div data-testid="slot-header">{slots.header}</div>
      <div data-testid="slot-nav">{slots.nav}</div>
      <div data-testid="slot-main">{slots.main}</div>
      <div data-testid="slot-details">{slots.details}</div>
    </div>
  ),
}));

jest.mock('./chat-room', () => ({
  ChatRoom: () => <div data-testid="chat-room" />,
}));

jest.mock('./chat-message-list', () => ({
  ChatMessageList: () => <div data-testid="chat-message-list" />,
}));

jest.mock('./chat-message-input', () => ({
  ChatMessageInput: () => <div data-testid="chat-message-input" />,
}));

jest.mock('./chat-header-details', () => ({
  ChatHeaderDetails: () => <div data-testid="chat-header-details" />,
}));

jest.mock('./hooks/use-collapse-nav', () => ({
  useCollapseNav: () => ({
    collapseDesktop: false,
    onCollapseDesktop: jest.fn(),
    onCloseDesktop: jest.fn(),
    openMobile: false,
    onOpenMobile: jest.fn(),
    onCloseMobile: jest.fn(),
  }),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ChatView', () => {
  it('renders dashboard content', () => {
    renderWithTheme(<ChatView />);
    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
  });

  it('renders chat title', () => {
    renderWithTheme(<ChatView />);
    expect(screen.getByText('chatModule.title')).toBeInTheDocument();
  });

  it('renders chat layout', () => {
    renderWithTheme(<ChatView />);
    expect(screen.getByTestId('chat-layout')).toBeInTheDocument();
  });

  it('renders chat nav in nav slot', () => {
    renderWithTheme(<ChatView />);
    expect(screen.getByTestId('chat-nav')).toBeInTheDocument();
  });

  it('renders empty content when no conversation selected', () => {
    renderWithTheme(<ChatView />);
    expect(screen.getByTestId('empty-content')).toBeInTheDocument();
    expect(screen.getByText('chatModule.emptyContent.title')).toBeInTheDocument();
  });

  it('renders message input', () => {
    renderWithTheme(<ChatView />);
    expect(screen.getByTestId('chat-message-input')).toBeInTheDocument();
  });
});
