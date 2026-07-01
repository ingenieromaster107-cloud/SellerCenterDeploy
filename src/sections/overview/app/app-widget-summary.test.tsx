import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppWidgetSummary } from './app-widget-summary';

jest.mock('src/components/chart', () => ({
  Chart: () => <div data-testid="chart" />,
  useChart: (opts: any) => opts,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/utils/format-number', () => ({
  fNumber: (v: number) => `num:${v}`,
  fPercent: (v: number) => `${v}%`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const baseChart = {
  categories: ['Jan', 'Feb', 'Mar'],
  series: [10, 20, 30],
};

describe('AppWidgetSummary', () => {
  it('renders title', () => {
    renderWithTheme(
      <AppWidgetSummary title="Total ventas" percent={5} total={1200} chart={baseChart} />
    );
    expect(screen.getByText('Total ventas')).toBeInTheDocument();
  });

  it('renders formatted total', () => {
    renderWithTheme(
      <AppWidgetSummary title="Pedidos" percent={2.5} total={450} chart={baseChart} />
    );
    expect(screen.getByText('num:450')).toBeInTheDocument();
  });

  it('renders formatted percent', () => {
    renderWithTheme(
      <AppWidgetSummary title="Tasa" percent={3.7} total={100} chart={baseChart} />
    );
    expect(screen.getByText(/3\.7%/)).toBeInTheDocument();
  });

  it('renders up-arrow icon when percent is positive', () => {
    renderWithTheme(
      <AppWidgetSummary title="Clientes" percent={10} total={500} chart={baseChart} />
    );
    expect(
      screen.getByTestId('icon-solar:double-alt-arrow-up-bold-duotone')
    ).toBeInTheDocument();
  });

  it('renders down-arrow icon when percent is negative', () => {
    renderWithTheme(
      <AppWidgetSummary title="Devoluciones" percent={-4} total={30} chart={baseChart} />
    );
    expect(
      screen.getByTestId('icon-solar:double-alt-arrow-down-bold-duotone')
    ).toBeInTheDocument();
  });

  it('renders chart', () => {
    renderWithTheme(
      <AppWidgetSummary title="X" percent={1} total={10} chart={baseChart} />
    );
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('renders + prefix when percent is positive', () => {
    renderWithTheme(
      <AppWidgetSummary title="X" percent={7} total={10} chart={baseChart} />
    );
    expect(screen.getByText(/\+7%/)).toBeInTheDocument();
  });
});
