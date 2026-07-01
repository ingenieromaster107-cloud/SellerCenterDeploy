import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatNavItem } from './chat-nav-item';

jest.mock('src/routes/paths', () => ({
  paths: { chat: { root: '/chat' } },
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('src/utils/format-time', () => ({
  fToNow: () => '5 min',
}));

jest.mock('src/utils/get-nav-item', () => ({
  getNavItem: () => ({
    group: false,
    displayName: 'Alice',
    displayText: 'Hello!',
    participants: [{ id: '1', name: 'Alice', avatarUrl: null, status: 'online' }],
    lastActivity: '2024-01-01',
    hasOnlineInGroup: false,
  }),
}));

jest.mock('src/auth/hooks', () => ({
  useMockedUser: () => ({ user: { id: '1' } }),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const conversation: any = {
  id: 'conv-1',
  type: 'ONE_TO_ONE',
  unreadCount: 0,
  messages: [],
  participants: [{ id: '2', name: 'Alice', avatarUrl: null }],
  lastActivity: '2024-01-01',
};

describe('ChatNavItem', () => {
  it('renders conversation display name', () => {
    renderWithTheme(
      <ChatNavItem
        selected={false}
        collapse={false}
        onCloseMobile={jest.fn()}
        conversation={conversation}
      />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders last message text when not collapsed', () => {
    renderWithTheme(
      <ChatNavItem
        selected={false}
        collapse={false}
        onCloseMobile={jest.fn()}
        conversation={conversation}
      />
    );
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('renders without crashing in collapsed state', () => {
    expect(() =>
      renderWithTheme(
        <ChatNavItem
          selected={false}
          collapse
          onCloseMobile={jest.fn()}
          conversation={conversation}
        />
      )
    ).not.toThrow();
  });
});
