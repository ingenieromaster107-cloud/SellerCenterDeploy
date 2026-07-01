import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppAreaInstalled } from './app-area-installed';

jest.mock('src/components/chart', () => ({
  Chart: () => <div data-testid="chart" />,
  useChart: (opts: any) => opts,
  ChartSelect: ({ options, value, onChange }: any) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="chart-select"
    >
      {options.map((o: string) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  ),
  ChartLegends: ({ labels }: any) => (
    <div data-testid="chart-legends">
      {labels.map((l: string) => (
        <span key={l}>{l}</span>
      ))}
    </div>
  ),
}));

jest.mock('src/utils/format-number', () => ({
  fNumber: (v: number) => `num:${v}`,
  fShortenNumber: (v: number) => `short:${v}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const chart = {
  categories: ['Jan', 'Feb', 'Mar'],
  series: [
    {
      name: '2023',
      data: [
        { name: 'Android', data: [10, 20, 30] },
        { name: 'iOS', data: [5, 15, 25] },
      ],
    },
    {
      name: '2024',
      data: [
        { name: 'Android', data: [15, 25, 35] },
        { name: 'iOS', data: [8, 18, 28] },
      ],
    },
  ],
};

describe('AppAreaInstalled', () => {
  it('renders title and subheader', () => {
    renderWithTheme(
      <AppAreaInstalled title="Instalaciones" subheader="Por plataforma" chart={chart} />
    );
    expect(screen.getByText('Instalaciones')).toBeInTheDocument();
    expect(screen.getByText('Por plataforma')).toBeInTheDocument();
  });

  it('renders chart', () => {
    renderWithTheme(<AppAreaInstalled chart={chart} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('renders series selector', () => {
    renderWithTheme(<AppAreaInstalled chart={chart} />);
    expect(screen.getByTestId('chart-select')).toBeInTheDocument();
  });

  it('renders legend labels', () => {
    renderWithTheme(<AppAreaInstalled chart={chart} />);
    expect(screen.getByText('Android')).toBeInTheDocument();
    expect(screen.getByText('iOS')).toBeInTheDocument();
  });
});
