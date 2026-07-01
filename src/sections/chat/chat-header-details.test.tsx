import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatHeaderDetails } from './chat-header-details';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

jest.mock('./chat-skeleton', () => ({
  ChatHeaderSkeleton: () => <div data-testid="chat-header-skeleton" />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const collapseNav = {
  collapseDesktop: false,
  onCollapseDesktop: jest.fn(),
  onCloseDesktop: jest.fn(),
  openMobile: false,
  onOpenMobile: jest.fn(),
  onCloseMobile: jest.fn(),
};

const participant: any = {
  id: '1',
  name: 'Alice Smith',
  avatarUrl: null,
  isClosed: 'OPEN',
};

describe('ChatHeaderDetails', () => {
  it('shows loading skeleton when loading', () => {
    renderWithTheme(
      <ChatHeaderDetails loading participants={[]} collapseNav={collapseNav} />
    );
    expect(screen.getByTestId('chat-header-skeleton')).toBeInTheDocument();
  });

  it('renders participant name when not loading', () => {
    renderWithTheme(
      <ChatHeaderDetails loading={false} participants={[participant]} collapseNav={collapseNav} />
    );
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('renders without crashing with no participants', () => {
    expect(() =>
      renderWithTheme(
        <ChatHeaderDetails loading={false} participants={[]} collapseNav={collapseNav} />
      )
    ).not.toThrow();
  });
});
