import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppCurrentDownload } from './app-current-download';

jest.mock('src/components/chart', () => ({
  Chart: () => <div data-testid="chart" />,
  useChart: (opts: any) => opts,
  ChartLegends: ({ labels }: any) => (
    <div data-testid="legend">
      {(labels ?? []).map((l: string) => (
        <span key={l}>{l}</span>
      ))}
    </div>
  ),
}));

jest.mock('src/utils/format-number', () => ({
  fNumber: (v: number) => `num:${v}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const chart = {
  series: [
    { label: 'Mac', value: 4400 },
    { label: 'Window', value: 5500 },
    { label: 'iOS', value: 1400 },
    { label: 'Android', value: 4000 },
  ],
};

describe('AppCurrentDownload', () => {
  it('renders title and subheader', () => {
    renderWithTheme(
      <AppCurrentDownload title="Descargas" subheader="Este mes" chart={chart} />
    );
    expect(screen.getByText('Descargas')).toBeInTheDocument();
    expect(screen.getByText('Este mes')).toBeInTheDocument();
  });

  it('renders chart', () => {
    renderWithTheme(<AppCurrentDownload chart={chart} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('renders legend', () => {
    renderWithTheme(<AppCurrentDownload chart={chart} />);
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders without crashing with empty series', () => {
    renderWithTheme(<AppCurrentDownload chart={{ series: [] }} />);
    expect(document.body).toBeInTheDocument();
  });
});
