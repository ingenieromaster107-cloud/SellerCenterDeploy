import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatMessageItem } from './chat-message-item';

jest.mock('src/utils/format-time', () => ({
  fToNow: (d: string) => `just now`,
}));

jest.mock('src/utils/get-message', () => ({
  getMessage: () => ({
    me: false,
    senderDetails: { firstName: 'Alice', avatarUrl: null },
    hasImage: false,
  }),
}));

jest.mock('src/auth/hooks', () => ({
  useMockedUser: () => ({ user: { id: '1' } }),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const message: any = {
  id: 'msg-1',
  body: 'Hello world!',
  createdAt: '2024-01-01T10:00:00Z',
  senderId: '2',
  contentType: 'text',
};

const participants: any[] = [
  { id: '2', name: 'Alice', avatarUrl: null },
];

describe('ChatMessageItem', () => {
  it('renders message body text', () => {
    renderWithTheme(
      <ChatMessageItem
        message={message}
        participants={participants}
        onOpenLightbox={jest.fn()}
      />
    );
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
  });

  it('renders sender name for non-me messages', () => {
    renderWithTheme(
      <ChatMessageItem
        message={message}
        participants={participants}
        onOpenLightbox={jest.fn()}
      />
    );
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });

  it('renders timestamp', () => {
    renderWithTheme(
      <ChatMessageItem
        message={message}
        participants={participants}
        onOpenLightbox={jest.fn()}
      />
    );
    expect(screen.getByText(/just now/)).toBeInTheDocument();
  });
});
