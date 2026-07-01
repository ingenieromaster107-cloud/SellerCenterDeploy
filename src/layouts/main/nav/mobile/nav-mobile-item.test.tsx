import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NavItem } from './nav-mobile-item';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.08)',
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/nav-section', () => ({
  createNavItem: ({ path, hasChild, externalLink }: any) => ({
    baseProps: externalLink
      ? { component: 'a', href: path, target: '_blank', rel: 'noopener' }
      : { component: 'a', href: path },
    renderIcon: <span data-testid="nav-icon" />,
  }),
  navSectionClasses: {
    item: { root: 'nav-item-root' },
    state: { open: 'nav-state-open', active: 'nav-state-active' },
  },
  navItemStyles: {
    icon: {},
    title: () => ({}),
    caption: () => ({}),
    arrow: () => ({}),
  },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('NavItem (mobile)', () => {
  it('renders title', () => {
    renderWithTheme(<NavItem title="Home" path="/home" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders with aria-label equal to title', () => {
    renderWithTheme(<NavItem title="Orders" path="/orders" />);
    expect(screen.getByLabelText('Orders')).toBeInTheDocument();
  });

  it('renders down arrow icon when has child and open', () => {
    renderWithTheme(<NavItem title="Menu" path="/menu" hasChild open />);
    expect(screen.getByTestId('icon-eva:arrow-ios-downward-fill')).toBeInTheDocument();
  });

  it('renders forward arrow icon when has child and not open', () => {
    renderWithTheme(<NavItem title="Menu" path="/menu" hasChild />);
    expect(screen.getByTestId('icon-eva:arrow-ios-forward-fill')).toBeInTheDocument();
  });

  it('does not render arrow icon when no children', () => {
    renderWithTheme(<NavItem title="Single" path="/single" />);
    expect(screen.queryByTestId('icon-eva:arrow-ios-forward-fill')).not.toBeInTheDocument();
  });

  it('renders nav icon', () => {
    renderWithTheme(<NavItem title="Products" path="/products" />);
    expect(screen.getByTestId('nav-icon')).toBeInTheDocument();
  });

  it('renders in active state', () => {
    renderWithTheme(<NavItem title="Active" path="/active" active />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
