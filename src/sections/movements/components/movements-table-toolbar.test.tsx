import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MovementsTableToolbar } from './movements-table-toolbar';

jest.mock('./movements-toolbar', () => ({
  MovementsToolbar: ({ dateFrom, dateTo }: any) => (
    <div data-testid="movements-toolbar">
      <span>{dateFrom}</span>
      <span>{dateTo}</span>
    </div>
  ),
}));

jest.mock('src/components/custom-data-grid', () => ({
  ToolbarContainer: ({ children }: any) => <div data-testid="toolbar-container">{children}</div>,
  ToolbarLeftPanel: ({ children }: any) => <div data-testid="toolbar-left">{children}</div>,
  ToolbarRightPanel: ({ children }: any) => <div data-testid="toolbar-right">{children}</div>,
  CustomToolbarQuickFilter: () => <div data-testid="quick-filter" />,
  CustomToolbarFilterButton: () => <div data-testid="filter-button" />,
  CustomToolbarExportButton: () => <div data-testid="export-button" />,
  CustomToolbarColumnsButton: () => <div data-testid="columns-button" />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const defaultProps = {
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31',
  onChange: jest.fn(),
  onExport: jest.fn(),
  isExporting: false,
  exportLimitExceeded: false,
};

describe('MovementsTableToolbar', () => {
  it('renders toolbar container', () => {
    renderWithTheme(<MovementsTableToolbar {...defaultProps} />);
    expect(screen.getByTestId('toolbar-container')).toBeInTheDocument();
  });

  it('renders left panel with MovementsToolbar', () => {
    renderWithTheme(<MovementsTableToolbar {...defaultProps} />);
    expect(screen.getByTestId('movements-toolbar')).toBeInTheDocument();
  });

  it('renders right panel with data-grid controls', () => {
    renderWithTheme(<MovementsTableToolbar {...defaultProps} />);
    expect(screen.getByTestId('toolbar-right')).toBeInTheDocument();
    expect(screen.getByTestId('quick-filter')).toBeInTheDocument();
    expect(screen.getByTestId('filter-button')).toBeInTheDocument();
    expect(screen.getByTestId('columns-button')).toBeInTheDocument();
  });

  it('passes dateFrom and dateTo to MovementsToolbar', () => {
    renderWithTheme(<MovementsTableToolbar {...defaultProps} />);
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('2024-01-31')).toBeInTheDocument();
  });
});
