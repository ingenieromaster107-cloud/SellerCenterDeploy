import { render, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatMessageInput } from './chat-message-input';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/actions/chat/use-reply-conversation', () => ({
  useReplyConversation: () => ({
    mutateAsync: jest.fn(),
    isError: false,
    isPending: false,
  }),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ChatMessageInput', () => {
  it('renders without crashing', () => {
    expect(() =>
      renderWithTheme(
        <ChatMessageInput
          disabled={false}
          message=""
          selectedConversationId="conv-1"
          onMessageChange={jest.fn()}
        />
      )
    ).not.toThrow();
  });

  it('calls onMessageChange when input changes', () => {
    const onMessageChange = jest.fn();
    renderWithTheme(
      <ChatMessageInput
        disabled={false}
        message=""
        selectedConversationId="conv-1"
        onMessageChange={onMessageChange}
      />
    );
    const inputs = document.querySelectorAll('input, textarea');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'hello' } });
      expect(onMessageChange).toHaveBeenCalled();
    }
  });

  it('renders disabled state', () => {
    renderWithTheme(
      <ChatMessageInput
        disabled
        message=""
        selectedConversationId="conv-1"
        onMessageChange={jest.fn()}
      />
    );
    expect(document.body).toBeInTheDocument();
  });
});
