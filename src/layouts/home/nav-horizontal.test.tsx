import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NavHorizontal } from './nav-horizontal';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.1)',
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('../core', () => ({
  layoutClasses: { nav: { root: 'nav-root', horizontal: 'nav-horizontal' } },
}));

jest.mock('src/components/nav-section', () => ({
  NavSectionHorizontal: ({ data }: any) => (
    <nav data-testid="nav-section-horizontal" data-items={data?.length ?? 0} />
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('NavHorizontal', () => {
  it('renders without crashing with empty data', () => {
    renderWithTheme(<NavHorizontal data={[]} />);
    expect(screen.getByTestId('nav-section-horizontal')).toBeInTheDocument();
  });

  it('passes nav data to NavSectionHorizontal', () => {
    const data = [{ subheader: 'Main', items: [{ title: 'Home', path: '/' }] }];
    renderWithTheme(<NavHorizontal data={data} />);
    expect(screen.getByTestId('nav-section-horizontal')).toHaveAttribute('data-items', '1');
  });
});
