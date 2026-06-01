import type { SellerReputationIndicatorsData } from 'src/interfaces/dashboard/seller-reputation-indicators';

import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppReputationPanel } from './app-reputation-panel';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
    currentLang: 'es',
  }),
}));

jest.mock('src/utils', () => ({
  formatPeriod: (value: string) => `fmt(${value})`,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('./components', () => ({
  MetricCard: ({ metric }: any) => (
    <div data-testid="metric-card" data-key={metric.key} data-level={String(metric.level)} />
  ),
  HealthScoreBar: ({ level }: any) => <div data-testid="health-bar" data-level={level} />,
}));

const theme = createTheme({ cssVariables: true });
const renderPanel = (data: SellerReputationIndicatorsData | null) =>
  render(
    <ThemeProvider theme={theme}>
      <AppReputationPanel data={data} />
    </ThemeProvider>
  );

const makeData = (
  partial: Partial<SellerReputationIndicatorsData> = {}
): SellerReputationIndicatorsData => ({
  reputation_level: 'GREEN',
  insufficient_data: false,
  completed_sales: 120,
  cancellation_rate: 2,
  cancellation_level: 'GREEN',
  cancellation_suggestion: null,
  claims_rate: 1,
  claims_level: 'GREEN',
  claims_suggestion: null,
  on_time_dispatch_rate: 98,
  on_time_dispatch_level: 'GREEN',
  on_time_dispatch_suggestion: null,
  avg_response_time: 4,
  avg_response_time_level: 'GREEN',
  avg_response_time_suggestion: null,
  period_from: '2024-05-01',
  period_to: '2024-05-31',
  calculated_at: '2024-06-01 10:00:00',
  ...partial,
});

describe('AppReputationPanel', () => {
  it('falls back to INSUFFICIENT_DATA and zero sales when data is null', () => {
    renderPanel(null);

    expect(screen.getByTestId('icon-solar:info-circle-bold')).toBeInTheDocument();
    expect(screen.getByText('reputationModule.completedSales: 0')).toBeInTheDocument();
    expect(screen.getByTestId('health-bar')).toHaveAttribute('data-level', 'INSUFFICIENT_DATA');
    expect(screen.queryByText(/reputationModule\.period/)).not.toBeInTheDocument();
  });

  it('renders the formatted period subheader when dates are present', () => {
    renderPanel(makeData());

    const subheader = screen.getByText(/reputationModule\.period/);
    expect(subheader).toHaveTextContent('fmt(2024-05-01)');
    expect(subheader).toHaveTextContent('fmt(2024-05-31)');
  });

  it('renders the four metric cards and the overall icon for GREEN', () => {
    renderPanel(makeData({ reputation_level: 'GREEN' }));

    const cards = screen.getAllByTestId('metric-card');
    expect(cards).toHaveLength(4);
    expect(cards.map((c) => c.getAttribute('data-key'))).toEqual([
      'cancellation',
      'claims',
      'onTimeDispatch',
      'avgResponseTime',
    ]);

    expect(screen.getByTestId('icon-solar:shield-check-bold')).toBeInTheDocument();
    expect(screen.getByTestId('health-bar')).toHaveAttribute('data-level', 'GREEN');
    expect(screen.getByText('reputationModule.completedSales: 120')).toBeInTheDocument();
  });

  it('uses the RED overall icon for a RED reputation level', () => {
    renderPanel(makeData({ reputation_level: 'RED' }));
    expect(screen.getByTestId('icon-solar:danger-triangle-bold')).toBeInTheDocument();
    expect(screen.getByTestId('health-bar')).toHaveAttribute('data-level', 'RED');
  });
});
