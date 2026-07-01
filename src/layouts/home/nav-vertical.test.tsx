import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NavVertical } from './nav-vertical';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.1)',
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('../core', () => ({
  layoutClasses: { nav: { root: 'nav-root', vertical: 'nav-vertical' } },
}));

jest.mock('src/routes/paths', () => ({
  paths: { account: { root: '/account' } },
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('src/auth/hooks', () => ({
  useAuthContext: () => ({
    user: { id: '1', displayName: 'Test Store', email: 'test@example.com', photoURL: null },
  }),
}));

jest.mock('src/components/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/components/store-identity', () => ({
  StoreIdentity: () => <div data-testid="store-identity" />,
}));

jest.mock('src/components', () => ({
  ProfileCompletionCard: () => <div data-testid="profile-completion-card" />,
}));

jest.mock('src/components/nav-section', () => ({
  NavSectionVertical: () => <nav data-testid="nav-section-vertical" />,
  NavSectionMini: () => <nav data-testid="nav-section-mini" />,
}));

jest.mock('../components', () => ({
  SignOutButton: () => <button data-testid="sign-out">Sign Out</button>,
  NavToggleButton: () => <button data-testid="nav-toggle" />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('NavVertical', () => {
  it('renders vertical nav section when not mini', () => {
    renderWithTheme(
      <NavVertical data={[]} isNavMini={false} onToggleNav={jest.fn()} />
    );
    expect(screen.getByTestId('nav-section-vertical')).toBeInTheDocument();
  });

  it('renders mini nav section when isNavMini is true', () => {
    renderWithTheme(
      <NavVertical data={[]} isNavMini onToggleNav={jest.fn()} />
    );
    expect(screen.getByTestId('nav-section-mini')).toBeInTheDocument();
  });

  it('renders toggle button', () => {
    renderWithTheme(
      <NavVertical data={[]} isNavMini={false} onToggleNav={jest.fn()} />
    );
    expect(screen.getByTestId('nav-toggle')).toBeInTheDocument();
  });

  it('renders logo in vertical mode', () => {
    renderWithTheme(
      <NavVertical data={[]} isNavMini={false} onToggleNav={jest.fn()} />
    );
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });
});
