import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { DashboardContent } from './content';

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('src/components/settings', () => ({
  useSettingsContext: () => ({
    state: { navLayout: 'vertical', compactLayout: false },
  }),
}));

jest.mock('../core', () => ({
  layoutClasses: { content: 'layout-content' },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('DashboardContent', () => {
  it('renders children', () => {
    renderWithTheme(
      <DashboardContent>
        <p>Dashboard page content</p>
      </DashboardContent>
    );
    expect(screen.getByText('Dashboard page content')).toBeInTheDocument();
  });

  it('renders without crashing when empty', () => {
    renderWithTheme(<DashboardContent />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    renderWithTheme(
      <DashboardContent>
        <span>Child A</span>
        <span>Child B</span>
      </DashboardContent>
    );
    expect(screen.getByText('Child A')).toBeInTheDocument();
    expect(screen.getByText('Child B')).toBeInTheDocument();
  });
});
