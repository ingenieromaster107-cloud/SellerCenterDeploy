import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatHeaderCompose } from './chat-header-compose';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.1)',
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

jest.mock('src/components/search-not-found', () => ({
  SearchNotFound: ({ query }: any) => <div data-testid="search-not-found">{query}</div>,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const contacts: any[] = [
  { id: '1', name: 'Alice', email: 'alice@test.com', avatarUrl: null },
  { id: '2', name: 'Bob', email: 'bob@test.com', avatarUrl: null },
];

describe('ChatHeaderCompose', () => {
  it('renders "To:" label', () => {
    renderWithTheme(<ChatHeaderCompose contacts={contacts} onAddRecipients={jest.fn()} />);
    expect(screen.getByText('To:')).toBeInTheDocument();
  });

  it('renders recipient search input', () => {
    renderWithTheme(<ChatHeaderCompose contacts={contacts} onAddRecipients={jest.fn()} />);
    expect(screen.getByPlaceholderText('+ Recipients')).toBeInTheDocument();
  });

  it('renders without crashing with empty contacts', () => {
    expect(() =>
      renderWithTheme(<ChatHeaderCompose contacts={[]} onAddRecipients={jest.fn()} />)
    ).not.toThrow();
  });
});
