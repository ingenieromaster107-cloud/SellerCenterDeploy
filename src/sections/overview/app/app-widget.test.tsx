import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppWidget } from './app-widget';

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

jest.mock('src/components/chart', () => ({
  Chart: () => <div data-testid="chart" />,
  useChart: (opts: any) => opts,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/svg-color', () => ({
  SvgColor: ({ src }: any) => <img src={src} alt="bg" />,
}));

jest.mock('src/utils/format-number', () => ({
  fNumber: (v: number) => `num:${v}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AppWidget', () => {
  it('renders title', () => {
    renderWithTheme(
      <AppWidget
        title="Visitas"
        total={5000}
        icon={'solar:user-bold' as any}
        chart={{ series: 75 }}
      />
    );
    expect(screen.getByText('Visitas')).toBeInTheDocument();
  });

  it('renders formatted total', () => {
    renderWithTheme(
      <AppWidget
        title="Ventas"
        total={1200}
        icon={'solar:bag-bold' as any}
        chart={{ series: 60 }}
      />
    );
    expect(screen.getByText('num:1200')).toBeInTheDocument();
  });

  it('renders chart', () => {
    renderWithTheme(
      <AppWidget
        title="X"
        total={0}
        icon={'solar:star-bold' as any}
        chart={{ series: 40 }}
      />
    );
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });
});
