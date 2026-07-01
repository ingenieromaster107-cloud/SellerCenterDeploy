import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatRoom } from './chat-room';

jest.mock('src/actions/chat-templates/use-get-templates', () => ({
  useGetTemplates: () => ({ data: undefined, isLoading: false }),
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div data-testid="scrollbar">{children}</div>,
}));

jest.mock('./chat-skeleton', () => ({
  ChatRoomSkeleton: () => <div data-testid="chat-room-skeleton" />,
}));

jest.mock('./chat-room-single', () => ({
  ChatRoomSingle: ({ participant }: any) => (
    <div data-testid="chat-room-single">{participant?.name}</div>
  ),
}));

jest.mock('./chat-room-attachments', () => ({
  ChatRoomAttachments: ({ attachments }: any) => (
    <div data-testid="chat-room-attachments">{attachments.length}</div>
  ),
}));

jest.mock('./chat-room-templates', () => ({
  ChatRoomTemplates: ({ templates }: any) => (
    <div data-testid="chat-room-templates">{templates.length}</div>
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

describe('ChatRoom', () => {
  it('shows skeleton when loading', () => {
    renderWithTheme(
      <ChatRoom
        loading
        participants={[]}
        messages={[]}
        collapseNav={collapseNav}
      />
    );
    expect(screen.getByTestId('chat-room-skeleton')).toBeInTheDocument();
  });

  it('renders room content when not loading', () => {
    renderWithTheme(
      <ChatRoom
        loading={false}
        participants={[]}
        messages={[]}
        collapseNav={collapseNav}
      />
    );
    expect(screen.getByTestId('chat-room-single')).toBeInTheDocument();
    expect(screen.getByTestId('chat-room-attachments')).toBeInTheDocument();
    expect(screen.getByTestId('chat-room-templates')).toBeInTheDocument();
  });

  it('passes messages attachments count to ChatRoomAttachments', () => {
    const messages: any[] = [
      { id: '1', attachments: [{ id: 'a1', name: 'file.pdf' }], productId: null },
    ];
    renderWithTheme(
      <ChatRoom
        loading={false}
        participants={[]}
        messages={messages}
        collapseNav={collapseNav}
      />
    );
    expect(screen.getByTestId('chat-room-attachments').textContent).toBe('1');
  });
});
