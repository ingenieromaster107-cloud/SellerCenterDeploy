import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NavItemDashboard } from './nav-desktop-item-dashboard';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.12)',
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

jest.mock('src/components/animate', () => ({
  varTap: () => ({}),
  varHover: () => ({}),
  transitionTap: () => ({}),
}));

jest.mock('framer-motion', () => ({
  m: {
    img: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
  },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('NavItemDashboard', () => {
  it('renders a link with the provided path', () => {
    renderWithTheme(<NavItemDashboard path="/dashboard" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('renders dashboard illustration image', () => {
    renderWithTheme(<NavItemDashboard path="/dashboard" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/assets/assets/illustrations/illustration-dashboard.webp');
  });

  it('renders with alt text', () => {
    renderWithTheme(<NavItemDashboard path="/dashboard" />);
    expect(screen.getByAltText('Dashboard illustration')).toBeInTheDocument();
  });
});
