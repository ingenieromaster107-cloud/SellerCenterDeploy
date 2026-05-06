import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { UploadResultsDetailTable } from './upload-results-detail-table';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span>{children}</span>,
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const labels = {
  rowColumn: 'Fila',
  productColumn: 'Producto',
  statusColumn: 'Estado',
  messageColumn: 'Mensaje',
  fieldsColumn: 'Errores',
  statusSuccess: 'Éxito',
  statusFailed: 'Fallido',
  showOnlyFailed: 'Solo fallidos',
  showAll: 'Ver todos',
};

const sampleResults = [
  { row: 1, product_id: 100, status: 'success', message: 'OK', errors: [] },
  {
    row: 2,
    product_id: null,
    status: 'failed',
    message: 'stock invalid',
    errors: [{ field: 'stock', message: 'must be >= 0' }],
  },
  {
    row: 3,
    product_id: null,
    status: 'failed',
    message: 'duplicated url',
    errors: [],
  },
];

describe('UploadResultsDetailTable', () => {
  it('shows only failed rows by default and exposes a toggle to show all', () => {
    renderWithTheme(<UploadResultsDetailTable results={sampleResults} labels={labels} />);
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
    expect(screen.getByText('stock invalid')).toBeInTheDocument();
    expect(screen.getByText('duplicated url')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ver todos/i })).toBeInTheDocument();
  });

  it('shows all rows when toggled', () => {
    renderWithTheme(<UploadResultsDetailTable results={sampleResults} labels={labels} />);
    fireEvent.click(screen.getByRole('button', { name: /ver todos/i }));
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('renders field-level errors for failed rows', () => {
    renderWithTheme(<UploadResultsDetailTable results={sampleResults} labels={labels} />);
    expect(screen.getByText('stock:')).toBeInTheDocument();
    expect(screen.getByText('must be >= 0')).toBeInTheDocument();
  });

  it('renders dash for failed rows without field errors', () => {
    renderWithTheme(<UploadResultsDetailTable results={sampleResults} labels={labels} />);
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });
});
