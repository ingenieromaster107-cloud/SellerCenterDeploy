import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatRoomTemplates } from './chat-room-templates';

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: (initial: boolean) => {
    const value = { current: initial };
    return {
      get value() { return value.current; },
      onTrue: jest.fn(() => { value.current = true; }),
      onFalse: jest.fn(() => { value.current = false; }),
      onToggle: jest.fn(() => { value.current = !value.current; }),
    };
  },
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('./styles', () => ({
  CollapseButton: ({ children, onClick }: any) => (
    <button data-testid="collapse-btn" onClick={onClick}>{children}</button>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const templates: any[] = [
  { entity_id: 1, title: 'Template A', content: 'Content A', is_active: 1 },
  { entity_id: 2, title: 'Template B', content: 'Content B', is_active: 1 },
];

describe('ChatRoomTemplates', () => {
  it('renders template count in button', () => {
    renderWithTheme(<ChatRoomTemplates templates={templates} />);
    expect(screen.getByText('Templates (2)')).toBeInTheDocument();
  });

  it('renders template titles', () => {
    renderWithTheme(<ChatRoomTemplates templates={templates} />);
    expect(screen.getByText('Template A')).toBeInTheDocument();
    expect(screen.getByText('Template B')).toBeInTheDocument();
  });

  it('calls onSelectTemplate when a template button is clicked', () => {
    const onSelectTemplate = jest.fn();
    renderWithTheme(
      <ChatRoomTemplates templates={templates} onSelectTemplate={onSelectTemplate} />
    );
    fireEvent.click(screen.getByText('Template A'));
    expect(onSelectTemplate).toHaveBeenCalledWith('Content A');
  });

  it('shows Templates (0) when no templates', () => {
    renderWithTheme(<ChatRoomTemplates templates={[]} />);
    expect(screen.getByText('Templates (0)')).toBeInTheDocument();
  });
});
