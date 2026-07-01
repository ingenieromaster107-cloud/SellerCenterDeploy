import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NavMobile } from './nav-mobile';

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('../core', () => ({
  layoutClasses: { nav: { root: 'nav-root', vertical: 'nav-vertical' } },
}));

jest.mock('src/routes/hooks', () => ({
  usePathname: () => '/dashboard',
}));

jest.mock('src/components/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/components/nav-section', () => ({
  NavSectionVertical: () => <nav data-testid="nav-section-vertical" />,
}));

jest.mock('../components', () => ({
  SignOutButton: () => <button data-testid="sign-out">Sign Out</button>,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('NavMobile', () => {
  it('renders drawer when open', () => {
    renderWithTheme(<NavMobile data={[]} open onClose={jest.fn()} />);
    expect(screen.getByTestId('nav-section-vertical')).toBeInTheDocument();
  });

  it('renders without crashing when closed', () => {
    expect(() =>
      renderWithTheme(<NavMobile data={[]} open={false} onClose={jest.fn()} />)
    ).not.toThrow();
  });

  it('renders logo and sign out button', () => {
    renderWithTheme(<NavMobile data={[]} open onClose={jest.fn()} />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('sign-out')).toBeInTheDocument();
  });
});
