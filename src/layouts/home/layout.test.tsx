import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: (init: boolean) => ({
    value: init,
    onTrue: jest.fn(),
    onFalse: jest.fn(),
    onToggle: jest.fn(),
  }),
}));

jest.mock('src/components/settings', () => ({
  useSettingsContext: () => ({
    state: { navColor: 'default', navLayout: 'vertical' },
    setField: jest.fn(),
  }),
}));

jest.mock('src/_mock', () => ({
  _notifications: [],
}));

jest.mock('src/components/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

jest.mock('../nav-config-home', () => ({
  useNavData: () => [],
}));

jest.mock('./nav-mobile', () => ({
  NavMobile: ({ open }: any) => <div data-testid="nav-mobile" data-open={open} />,
}));

jest.mock('./nav-vertical', () => ({
  NavVertical: () => <div data-testid="nav-vertical" />,
}));

jest.mock('./nav-horizontal', () => ({
  NavHorizontal: () => <div data-testid="nav-horizontal" />,
}));

jest.mock('./content', () => ({
  VerticalDivider: () => <div data-testid="vertical-divider" />,
}));

jest.mock('./css-vars', () => ({
  dashboardLayoutVars: () => ({}),
  dashboardNavColorVars: () => ({ section: {}, layout: {} }),
}));

jest.mock('../core', () => ({
  MainSection: ({ children }: any) => <main data-testid="main-section">{children}</main>,
  LayoutSection: ({ children, headerSection, sidebarSection, footerSection }: any) => (
    <div data-testid="layout-section">
      <div data-testid="header-slot">{headerSection}</div>
      <div data-testid="sidebar-slot">{sidebarSection}</div>
      <div data-testid="footer-slot">{footerSection}</div>
      {children}
    </div>
  ),
  HeaderSection: ({ slots }: any) => (
    <header data-testid="header-section">
      {slots?.leftArea}
      {slots?.rightArea}
      {slots?.bottomArea}
    </header>
  ),
  layoutClasses: { sidebarContainer: 'sidebar-container' },
}));

jest.mock('../components', () => ({
  Searchbar: () => <div data-testid="searchbar" />,
  MenuButton: ({ onClick }: any) => <button data-testid="menu-button" onClick={onClick} />,
  StoreButton: () => <div data-testid="store-button" />,
  LanguagePopover: () => <div data-testid="language-popover" />,
  ThemeToggleButton: () => <div data-testid="theme-toggle-button" />,
  NotificationsDrawer: () => <div data-testid="notifications-drawer" />,
}));

import { HomeLayout } from './layout';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('HomeLayout', () => {
  it('renders layout section', () => {
    renderWithTheme(<HomeLayout>content</HomeLayout>);
    expect(screen.getByTestId('layout-section')).toBeInTheDocument();
  });

  it('renders children via main section', () => {
    renderWithTheme(<HomeLayout><span data-testid="child">hello</span></HomeLayout>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders header section', () => {
    renderWithTheme(<HomeLayout>content</HomeLayout>);
    expect(screen.getByTestId('header-section')).toBeInTheDocument();
  });

  it('renders nav vertical sidebar (vertical layout)', () => {
    renderWithTheme(<HomeLayout>content</HomeLayout>);
    expect(screen.getByTestId('nav-vertical')).toBeInTheDocument();
  });

  it('renders nav mobile', () => {
    renderWithTheme(<HomeLayout>content</HomeLayout>);
    expect(screen.getByTestId('nav-mobile')).toBeInTheDocument();
  });

  it('renders searchbar', () => {
    renderWithTheme(<HomeLayout>content</HomeLayout>);
    expect(screen.getByTestId('searchbar')).toBeInTheDocument();
  });

  it('renders store button', () => {
    renderWithTheme(<HomeLayout>content</HomeLayout>);
    expect(screen.getByTestId('store-button')).toBeInTheDocument();
  });

  it('renders menu button', () => {
    renderWithTheme(<HomeLayout>content</HomeLayout>);
    expect(screen.getByTestId('menu-button')).toBeInTheDocument();
  });
});
