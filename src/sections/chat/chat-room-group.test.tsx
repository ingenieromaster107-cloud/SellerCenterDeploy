import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatRoomGroup } from './chat-room-group';

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: (initial: boolean) => ({
    value: initial,
    onTrue: jest.fn(),
    onFalse: jest.fn(),
    onToggle: jest.fn(),
  }),
}));

jest.mock('./styles', () => ({
  CollapseButton: ({ children, onClick }: any) => (
    <button data-testid="collapse-btn" onClick={onClick}>{children}</button>
  ),
}));

jest.mock('./chat-room-participant-dialog', () => ({
  ChatRoomParticipantDialog: ({ participant, onClose }: any) =>
    participant ? (
      <div data-testid="participant-dialog">
        {participant.name}
        <button onClick={onClose}>close</button>
      </div>
    ) : null,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const participants: any[] = [
  { id: '1', name: 'Alice', role: 'Seller', avatarUrl: null, status: 'online' },
  { id: '2', name: 'Bob', role: 'Buyer', avatarUrl: null, status: 'away' },
];

describe('ChatRoomGroup', () => {
  it('renders participant count in collapse button', () => {
    renderWithTheme(<ChatRoomGroup participants={participants} />);
    expect(screen.getByText('In room (2)')).toBeInTheDocument();
  });

  it('renders all participant names', () => {
    renderWithTheme(<ChatRoomGroup participants={participants} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('opens participant dialog when clicking a participant', () => {
    renderWithTheme(<ChatRoomGroup participants={participants} />);
    fireEvent.click(screen.getByText('Alice'));
    expect(screen.getByTestId('participant-dialog')).toBeInTheDocument();
  });

  it('closes dialog when close button is clicked', () => {
    renderWithTheme(<ChatRoomGroup participants={participants} />);
    fireEvent.click(screen.getByText('Alice'));
    fireEvent.click(screen.getByText('close'));
    expect(screen.queryByTestId('participant-dialog')).not.toBeInTheDocument();
  });
});
