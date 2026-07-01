import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatRoomAttachments } from './chat-room-attachments';

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: (initial: boolean) => ({
    value: initial,
    onTrue: jest.fn(),
    onFalse: jest.fn(),
    onToggle: jest.fn(),
  }),
}));

jest.mock('src/utils/format-time', () => ({
  fDateTime: (d: string) => `date:${d}`,
}));

jest.mock('src/components/file-thumbnail', () => ({
  FileThumbnail: ({ file }: any) => <div data-testid="file-thumbnail">{file}</div>,
}));

jest.mock('./styles', () => ({
  CollapseButton: ({ children, onClick }: any) => (
    <button data-testid="collapse-btn" onClick={onClick}>{children}</button>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const attachments: any[] = [
  { name: 'invoice.pdf', preview: '/invoice.pdf', createdAt: '2024-01-01' },
  { name: 'photo.jpg', preview: '/photo.jpg', createdAt: '2024-01-02' },
];

describe('ChatRoomAttachments', () => {
  it('renders attachment count in collapse button', () => {
    renderWithTheme(<ChatRoomAttachments attachments={attachments} />);
    expect(screen.getByText('Attachments (2)')).toBeInTheDocument();
  });

  it('renders attachment names', () => {
    renderWithTheme(<ChatRoomAttachments attachments={attachments} />);
    expect(screen.getByText('invoice.pdf')).toBeInTheDocument();
    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
  });

  it('renders zero count with empty attachments', () => {
    renderWithTheme(<ChatRoomAttachments attachments={[]} />);
    expect(screen.getByText('Attachments (0)')).toBeInTheDocument();
  });
});
