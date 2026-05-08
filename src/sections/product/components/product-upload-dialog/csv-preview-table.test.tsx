import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CsvPreviewTable } from './csv-preview-table';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const labels = {
  errorTooltipTitle: 'Errores',
  rowsLabel: 'filas',
  errorsLabel: 'con errores',
  emptyCellLabel: 'vacío',
};

describe('CsvPreviewTable', () => {
  it('renders headers and rows', () => {
    renderWithTheme(
      <CsvPreviewTable
        headers={['sku', 'name']}
        rows={[
          { sku: 'A1', name: 'Producto 1' },
          { sku: 'A2', name: 'Producto 2' },
        ]}
        rowErrorMap={new Map()}
        {...labels}
      />
    );
    expect(screen.getByText('sku')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
  });

  it('shows the row count', () => {
    renderWithTheme(
      <CsvPreviewTable
        headers={['sku']}
        rows={[{ sku: 'X1' }, { sku: 'X2' }, { sku: 'X3' }]}
        rowErrorMap={new Map()}
        {...labels}
      />
    );
    // The summary line is "<strong>3</strong> filas".
    const strong = screen.getAllByText('3').find((el) => el.tagName === 'STRONG');
    expect(strong).toBeDefined();
    expect(screen.getByText(/filas/i)).toBeInTheDocument();
  });

  it('shows the errors count when there are row errors', () => {
    renderWithTheme(
      <CsvPreviewTable
        headers={['sku']}
        rows={[{ sku: 'A1' }]}
        rowErrorMap={new Map([[0, ['fail']]])}
        {...labels}
      />
    );
    expect(screen.getByText(/con errores/i)).toBeInTheDocument();
  });

  it('renders the placeholder for empty cells', () => {
    renderWithTheme(
      <CsvPreviewTable
        headers={['sku', 'name']}
        rows={[{ sku: 'A1', name: '' }]}
        rowErrorMap={new Map()}
        {...labels}
      />
    );
    expect(screen.getByText('vacío')).toBeInTheDocument();
  });

  it('paginates rows when the count exceeds the page size', () => {
    const rows = Array.from({ length: 25 }).map((_, i) => ({ sku: `R${i}` }));
    renderWithTheme(
      <CsvPreviewTable headers={['sku']} rows={rows} rowErrorMap={new Map()} {...labels} />
    );

    // Page 1 (rows 0-9): R0 visible, R10 not yet
    expect(screen.getByText('R0')).toBeInTheDocument();
    expect(screen.queryByText('R10')).not.toBeInTheDocument();

    // Click "next" to go to page 2 (rows 10-19)
    fireEvent.click(screen.getByRole('button', { name: /go to next page/i }));
    expect(screen.getByText('R10')).toBeInTheDocument();
    expect(screen.queryByText('R0')).not.toBeInTheDocument();
  });
});
