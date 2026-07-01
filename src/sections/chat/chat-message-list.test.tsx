import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatMessageList } from './chat-message-list';

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/components/lightbox', () => ({
  Lightbox: () => null,
  useLightbox: () => ({ selected: -1, open: false, onOpen: jest.fn(), onClose: jest.fn() }),
}));

jest.mock('./chat-message-item', () => ({
  ChatMessageItem: ({ message }: any) => <div data-testid="message-item">{message.body}</div>,
}));

jest.mock('./hooks/use-messages-scroll', () => ({
  useMessagesScroll: () => ({ messagesEndRef: { current: null } }),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const messages: any[] = [
  { id: 'm1', body: 'Hello!', contentType: 'text', senderId: '1', createdAt: '2024-01-01' },
  { id: 'm2', body: 'World!', contentType: 'text', senderId: '2', createdAt: '2024-01-01' },
];

describe('ChatMessageList', () => {
  it('renders message items', () => {
    renderWithTheme(
      <ChatMessageList messages={messages} participants={[]} loading={false} />
    );
    expect(screen.getAllByTestId('message-item')).toHaveLength(2);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('World!')).toBeInTheDocument();
  });

  it('shows loading progress when loading', () => {
    renderWithTheme(
      <ChatMessageList messages={[]} participants={[]} loading />
    );
    expect(document.querySelector('.MuiLinearProgress-root')).toBeInTheDocument();
    expect(screen.queryByTestId('message-item')).not.toBeInTheDocument();
  });

  it('renders empty list without crashing', () => {
    expect(() =>
      renderWithTheme(<ChatMessageList messages={[]} participants={[]} loading={false} />)
    ).not.toThrow();
  });
});
