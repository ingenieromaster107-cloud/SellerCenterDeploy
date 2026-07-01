import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatRoomParticipantDialog } from './chat-room-participant-dialog';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.1)',
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const participant: any = {
  id: '1',
  name: 'Alice Smith',
  role: 'Seller',
  avatarUrl: null,
  address: '123 Main St',
  email: 'alice@test.com',
  phone: '+1234567890',
};

describe('ChatRoomParticipantDialog', () => {
  it('renders participant name when open', () => {
    renderWithTheme(
      <ChatRoomParticipantDialog open onClose={jest.fn()} participant={participant} />
    );
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('renders participant role', () => {
    renderWithTheme(
      <ChatRoomParticipantDialog open onClose={jest.fn()} participant={participant} />
    );
    expect(screen.getByText('Seller')).toBeInTheDocument();
  });

  it('renders participant address', () => {
    renderWithTheme(
      <ChatRoomParticipantDialog open onClose={jest.fn()} participant={participant} />
    );
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    renderWithTheme(
      <ChatRoomParticipantDialog open onClose={onClose} participant={participant} />
    );
    const closeBtn = document.querySelector('button');
    if (closeBtn) fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when closed', () => {
    renderWithTheme(
      <ChatRoomParticipantDialog open={false} onClose={jest.fn()} participant={participant} />
    );
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
  });
});
