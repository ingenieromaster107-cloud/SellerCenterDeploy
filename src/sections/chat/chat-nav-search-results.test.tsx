import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatNavSearchResults } from './chat-nav-search-results';

jest.mock('src/components/search-not-found', () => ({
  SearchNotFound: ({ query }: any) => <div data-testid="search-not-found">{query}</div>,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const participants: any[] = [
  { id: '1', name: 'Alice', avatarUrl: null },
  { id: '2', name: 'Bob', avatarUrl: null },
];

describe('ChatNavSearchResults', () => {
  it('renders participant names in results', () => {
    renderWithTheme(
      <ChatNavSearchResults query="al" results={participants} onClickResult={jest.fn()} />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows search not found when query has no results', () => {
    renderWithTheme(
      <ChatNavSearchResults query="zzz" results={[]} onClickResult={jest.fn()} />
    );
    expect(screen.getByTestId('search-not-found')).toBeInTheDocument();
  });

  it('does not show not-found when query is empty with no results', () => {
    renderWithTheme(
      <ChatNavSearchResults query="" results={[]} onClickResult={jest.fn()} />
    );
    expect(screen.queryByTestId('search-not-found')).not.toBeInTheDocument();
  });

  it('calls onClickResult when participant is clicked', () => {
    const onClickResult = jest.fn();
    renderWithTheme(
      <ChatNavSearchResults query="a" results={participants} onClickResult={onClickResult} />
    );
    fireEvent.click(screen.getByText('Alice'));
    expect(onClickResult).toHaveBeenCalledWith(participants[0]);
  });
});
