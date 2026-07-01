import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MainSection } from './main-section';

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('./classes', () => ({
  layoutClasses: { main: 'layout-main' },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('MainSection', () => {
  it('renders children', () => {
    renderWithTheme(<MainSection><span>main child</span></MainSection>);
    expect(screen.getByText('main child')).toBeInTheDocument();
  });

  it('renders as a <main> element', () => {
    renderWithTheme(<MainSection><span>content</span></MainSection>);
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    renderWithTheme(
      <MainSection>
        <span>first</span>
        <span>second</span>
      </MainSection>
    );
    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
  });

  it('renders empty without crashing', () => {
    expect(() => renderWithTheme(<MainSection />)).not.toThrow();
  });
});
