import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { UploadResultsSummary } from './upload-results-summary';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const labels = { total: 'Total', processed: 'Procesados', success: 'Exitosos', failed: 'Fallidos' };

describe('UploadResultsSummary', () => {
  it('renders four stat cards with values', () => {
    renderWithTheme(
      <UploadResultsSummary
        summary={{ total_rows: 50, processed_rows: 50, success_rows: 30, failed_rows: 20 }}
        labels={labels}
      />
    );

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Procesados')).toBeInTheDocument();
    expect(screen.getByText('Exitosos')).toBeInTheDocument();
    expect(screen.getByText('Fallidos')).toBeInTheDocument();
    expect(screen.getAllByText('50')).toHaveLength(2); // total + processed
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('handles all-zero summary', () => {
    renderWithTheme(
      <UploadResultsSummary
        summary={{ total_rows: 0, processed_rows: 0, success_rows: 0, failed_rows: 0 }}
        labels={labels}
      />
    );
    expect(screen.getAllByText('0')).toHaveLength(4);
  });
});
