import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { HeaderSection } from './header-section';

jest.mock('minimal-shared/hooks', () => ({
  useScrollOffsetTop: () => ({ offsetTop: false }),
}));

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.8)',
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('./classes', () => ({
  layoutClasses: { header: 'layout-header' },
}));

const theme = createTheme({
  cssVariables: true,
  mixins: {
    bgBlur: () => ({}),
    bgGradient: () => ({}),
  },
  customShadows: {
    z8: '0 8px 16px rgba(0,0,0,0.16)',
  },
} as any);

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('HeaderSection', () => {
  it('renders without crashing', () => {
    renderWithTheme(<HeaderSection />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders left area slot', () => {
    renderWithTheme(
      <HeaderSection slots={{ leftArea: <span>Logo</span> }} />
    );
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('renders right area slot', () => {
    renderWithTheme(
      <HeaderSection slots={{ rightArea: <button type="button">Login</button> }} />
    );
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders center area slot', () => {
    renderWithTheme(
      <HeaderSection slots={{ centerArea: <nav>Navigation</nav> }} />
    );
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('renders top area slot', () => {
    renderWithTheme(
      <HeaderSection slots={{ topArea: <div>Top Banner</div> }} />
    );
    expect(screen.getByText('Top Banner')).toBeInTheDocument();
  });

  it('renders bottom area slot', () => {
    renderWithTheme(
      <HeaderSection slots={{ bottomArea: <div>Bottom Bar</div> }} />
    );
    expect(screen.getByText('Bottom Bar')).toBeInTheDocument();
  });
});
