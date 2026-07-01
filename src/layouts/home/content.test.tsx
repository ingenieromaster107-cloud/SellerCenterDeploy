import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { HomeContent } from './content';

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('../core', () => ({
  layoutClasses: { content: 'layout-content' },
}));

jest.mock('src/components/settings', () => ({
  useSettingsContext: () => ({
    state: { navLayout: 'vertical', compactLayout: true },
  }),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('HomeContent', () => {
  it('renders children', () => {
    renderWithTheme(<HomeContent><span>page content</span></HomeContent>);
    expect(screen.getByText('page content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    renderWithTheme(
      <HomeContent>
        <span>first</span>
        <span>second</span>
      </HomeContent>
    );
    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
  });

  it('renders without children', () => {
    expect(() => renderWithTheme(<HomeContent />)).not.toThrow();
  });
});
