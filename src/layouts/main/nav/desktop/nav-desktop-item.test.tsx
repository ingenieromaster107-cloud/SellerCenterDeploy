import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NavItem } from './nav-desktop-item';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.12)',
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
    renderIcon: null,
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

describe('NavItem (desktop)', () => {
  it('renders title text', () => {
    renderWithTheme(<NavItem title="Products" path="/products" />);
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('renders with aria-label equal to title', () => {
    renderWithTheme(<NavItem title="Orders" path="/orders" />);
    const item = screen.getByLabelText('Orders');
    expect(item).toBeInTheDocument();
  });

  it('renders arrow icon when hasChild', () => {
    renderWithTheme(<NavItem title="Menu" path="/menu" hasChild />);
    expect(screen.getByTestId('icon-eva:arrow-ios-downward-fill')).toBeInTheDocument();
  });

  it('does not render arrow icon when no children', () => {
    renderWithTheme(<NavItem title="Single" path="/single" />);
    expect(screen.queryByTestId('icon-eva:arrow-ios-downward-fill')).not.toBeInTheDocument();
  });

  it('renders as root item by default', () => {
    renderWithTheme(<NavItem title="Home" path="/home" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders as subItem when subItem prop is true', () => {
    renderWithTheme(<NavItem title="SubMenu" path="/sub" subItem />);
    expect(screen.getByText('SubMenu')).toBeInTheDocument();
  });

  it('renders with active state', () => {
    renderWithTheme(<NavItem title="Active" path="/active" active />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders with open state', () => {
    renderWithTheme(<NavItem title="Open" path="/open" open />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
