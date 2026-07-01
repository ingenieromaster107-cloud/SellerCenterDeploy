import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { KpiMetricCard } from './kpi-metric-card';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/utils/format-number', () => ({
  fNumber: (v: number) => `num:${v}`,
  fPercent: (v: number) => `pct:${v}`,
  fCurrency: (v: number) => `cur:${v}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const baseMetric = {
  current: 100000,
  previous: 80000,
  variation_pct: 25,
  is_new: false,
};

describe('KpiMetricCard', () => {
  it('renders skeleton when loading', () => {
    renderWithTheme(
      <KpiMetricCard
        title="Ventas brutas"
        metric={baseMetric}
        format="currency"
        additive
        hasComparison
        isLoading
      />
    );
    expect(screen.getByText('Ventas brutas')).toBeInTheDocument();
    expect(screen.queryByText('cur:100000')).not.toBeInTheDocument();
  });

  it('renders current value without comparison', () => {
    renderWithTheme(
      <KpiMetricCard
        title="Unidades vendidas"
        metric={baseMetric}
        format="number"
        additive
        hasComparison={false}
        isLoading={false}
      />
    );
    expect(screen.getByText('num:100000')).toBeInTheDocument();
    expect(screen.getByText('Unidades vendidas')).toBeInTheDocument();
  });

  it('renders period label when provided and no comparison', () => {
    renderWithTheme(
      <KpiMetricCard
        title="Visitas"
        metric={baseMetric}
        format="number"
        additive
        hasComparison={false}
        isLoading={false}
        periodLabel="Últimos 30 días"
      />
    );
    expect(screen.getByText('Últimos 30 días')).toBeInTheDocument();
  });

  it('renders comparison with both periods', () => {
    renderWithTheme(
      <KpiMetricCard
        title="Conversión"
        metric={baseMetric}
        format="percent"
        additive={false}
        hasComparison
        isLoading={false}
      />
    );
    expect(screen.getByText('pct:100000')).toBeInTheDocument();
    expect(screen.getByText('pct:80000')).toBeInTheDocument();
  });

  it('renders trending up icon for positive variation', () => {
    renderWithTheme(
      <KpiMetricCard
        title="Ventas"
        metric={baseMetric}
        format="currency"
        additive
        hasComparison
        isLoading={false}
      />
    );
    expect(screen.getByTestId('icon-eva:trending-up-fill')).toBeInTheDocument();
  });

  it('renders trending down icon for negative variation', () => {
    const negativeMetric = { ...baseMetric, variation_pct: -10 };
    renderWithTheme(
      <KpiMetricCard
        title="Ventas"
        metric={negativeMetric}
        format="currency"
        additive
        hasComparison
        isLoading={false}
      />
    );
    expect(screen.getByTestId('icon-eva:trending-down-fill')).toBeInTheDocument();
  });

  it('renders noChange text when variation is 0', () => {
    const zeroVariation = { ...baseMetric, variation_pct: 0 };
    renderWithTheme(
      <KpiMetricCard
        title="Ventas"
        metric={zeroVariation}
        format="currency"
        additive
        hasComparison
        isLoading={false}
      />
    );
    expect(screen.getByText('dashboardModule.kpiMetrics.noChange')).toBeInTheDocument();
  });

  it('renders "new" chip when metric is new', () => {
    const newMetric = { ...baseMetric, is_new: true };
    renderWithTheme(
      <KpiMetricCard
        title="Nueva métrica"
        metric={newMetric}
        format="number"
        additive
        hasComparison
        isLoading={false}
      />
    );
    expect(screen.getByText('dashboardModule.kpiMetrics.new')).toBeInTheDocument();
  });

  it('renders without metric (defaults to 0)', () => {
    renderWithTheme(
      <KpiMetricCard
        title="Sin datos"
        metric={undefined}
        format="currency"
        additive
        hasComparison={false}
        isLoading={false}
      />
    );
    expect(screen.getByText('cur:0')).toBeInTheDocument();
  });

  it('shows different duration warning when periodDays !== compareDays', () => {
    renderWithTheme(
      <KpiMetricCard
        title="Ventas"
        metric={baseMetric}
        format="currency"
        additive
        hasComparison
        isLoading={false}
        periodDays={30}
        compareDays={7}
      />
    );
    expect(screen.getByText(/dashboardModule.kpiMetrics.differentDuration/)).toBeInTheDocument();
  });

  it('shows daily average when additive and different durations', () => {
    renderWithTheme(
      <KpiMetricCard
        title="Ventas"
        metric={baseMetric}
        format="currency"
        additive
        hasComparison
        isLoading={false}
        periodDays={30}
        compareDays={7}
      />
    );
    expect(screen.getByText(/dashboardModule.kpiMetrics.dailyAverage/)).toBeInTheDocument();
  });

  it('renders vs label in comparison view', () => {
    renderWithTheme(
      <KpiMetricCard
        title="Ventas"
        metric={baseMetric}
        format="currency"
        additive
        hasComparison
        isLoading={false}
        periodDays={30}
        compareDays={30}
      />
    );
    expect(screen.getAllByText('dashboardModule.kpiMetrics.vs').length).toBeGreaterThan(0);
  });
});
