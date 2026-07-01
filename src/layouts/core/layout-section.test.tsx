import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { LayoutSection } from './layout-section';

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('./classes', () => ({
  layoutClasses: { root: 'layout-root', sidebarContainer: 'layout-sidebar-container' },
}));

jest.mock('./css-vars', () => ({
  layoutSectionVars: () => ({}),
}));

jest.mock('@mui/material/GlobalStyles', () => ({
  __esModule: true,
  default: () => null,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('LayoutSection', () => {
  it('renders children', () => {
    renderWithTheme(<LayoutSection><span>child content</span></LayoutSection>);
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('renders header section', () => {
    renderWithTheme(
      <LayoutSection headerSection={<div data-testid="header">header</div>}>
        <span>child</span>
      </LayoutSection>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders footer section', () => {
    renderWithTheme(
      <LayoutSection footerSection={<div data-testid="footer">footer</div>}>
        <span>child</span>
      </LayoutSection>
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders sidebar section and sidebar container', () => {
    renderWithTheme(
      <LayoutSection sidebarSection={<div data-testid="sidebar">sidebar</div>}>
        <span>child</span>
      </LayoutSection>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('renders all slots together with sidebar', () => {
    renderWithTheme(
      <LayoutSection
        headerSection={<div data-testid="header">header</div>}
        footerSection={<div data-testid="footer">footer</div>}
        sidebarSection={<div data-testid="sidebar">sidebar</div>}
      >
        <span>main</span>
      </LayoutSection>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
  });
});
