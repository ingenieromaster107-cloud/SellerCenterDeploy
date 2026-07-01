import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatRoomSingle } from './chat-room-single';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const openParticipant: any = {
  id: '1',
  name: 'Alice Smith',
  role: 'Seller',
  avatarUrl: null,
  isClosed: 'OPEN',
};

const closedParticipant: any = {
  ...openParticipant,
  isClosed: 'CLOSED',
};

describe('ChatRoomSingle', () => {
  it('renders participant name', () => {
    renderWithTheme(<ChatRoomSingle participant={openParticipant} />);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('renders participant role', () => {
    renderWithTheme(<ChatRoomSingle participant={openParticipant} />);
    expect(screen.getByText('Seller')).toBeInTheDocument();
  });

  it('shows open status for open conversation', () => {
    renderWithTheme(<ChatRoomSingle participant={openParticipant} />);
    expect(screen.getByText('chatModule.chatRoom.chatStatus.open')).toBeInTheDocument();
  });

  it('shows closed status for closed conversation', () => {
    renderWithTheme(<ChatRoomSingle participant={closedParticipant} />);
    expect(screen.getByText('chatModule.chatRoom.chatStatus.closed')).toBeInTheDocument();
  });
});
