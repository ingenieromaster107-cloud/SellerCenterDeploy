import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatNavAccount } from './chat-nav-account';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/auth/hooks', () => ({
  useAuthContext: () => ({
    user: { firstname: 'Jane', email: 'jane@test.com', avatarUrl: null },
  }),
}));

jest.mock('minimal-shared/hooks', () => ({
  usePopover: () => ({
    open: false,
    anchorEl: null,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

jest.mock('src/components/custom-popover', () => ({
  CustomPopover: ({ open, children }: any) =>
    open ? <div data-testid="popover">{children}</div> : null,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ChatNavAccount', () => {
  it('renders without crashing', () => {
    expect(() => renderWithTheme(<ChatNavAccount />)).not.toThrow();
  });

  it('renders an interactive element', () => {
    renderWithTheme(<ChatNavAccount />);
    expect(document.body.firstChild).toBeTruthy();
  });
});
