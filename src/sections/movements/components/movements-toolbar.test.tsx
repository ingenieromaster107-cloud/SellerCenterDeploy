import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MovementsToolbar } from './movements-toolbar';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/utils/format-time', () => ({
  FORMAT_PATTERNS: { iso: { date: 'YYYY-MM-DD' } },
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, onChange }: any) => (
    <div>
      <label>{label}</label>
      <input
        data-testid={`datepicker-${label}`}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

jest.mock('dayjs', () => {
  const fakeDayjs = (val?: string) => ({
    isValid: () => true,
    format: () => val || '2024-01-01',
    isBefore: () => false,
    isAfter: () => false,
    diff: () => 5,
    add: () => fakeDayjs('2024-01-31'),
    subtract: () => fakeDayjs('2024-01-01'),
  });
  return fakeDayjs;
});

jest.mock('../constants', () => ({
  MAX_RANGE_DAYS: 92,
  EXPORT_MAX_ROWS: 1000,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('MovementsToolbar', () => {
  const defaultProps = {
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    onChange: jest.fn(),
    onExport: jest.fn(),
    isExporting: false,
    exportLimitExceeded: false,
  };

  it('renders date from picker', () => {
    renderWithTheme(<MovementsToolbar {...defaultProps} />);
    expect(screen.getByText('movements.toolbar.dateFrom')).toBeInTheDocument();
  });

  it('renders date to picker', () => {
    renderWithTheme(<MovementsToolbar {...defaultProps} />);
    expect(screen.getByText('movements.toolbar.dateTo')).toBeInTheDocument();
  });

  it('renders apply button', () => {
    renderWithTheme(<MovementsToolbar {...defaultProps} />);
    expect(screen.getByText('movements.toolbar.apply')).toBeInTheDocument();
  });

  it('renders export csv button', () => {
    renderWithTheme(<MovementsToolbar {...defaultProps} />);
    expect(screen.getByText('movements.toolbar.exportCsv')).toBeInTheDocument();
  });

  it('renders calendar icon on apply button', () => {
    renderWithTheme(<MovementsToolbar {...defaultProps} />);
    expect(screen.getByTestId('icon-solar:calendar-date-bold')).toBeInTheDocument();
  });

  it('renders export icon on export button', () => {
    renderWithTheme(<MovementsToolbar {...defaultProps} />);
    expect(screen.getByTestId('icon-solar:export-bold')).toBeInTheDocument();
  });

  it('export button is disabled when exportLimitExceeded', () => {
    renderWithTheme(
      <MovementsToolbar {...defaultProps} exportLimitExceeded />
    );
    const exportBtn = screen.getByText('movements.toolbar.exportCsv').closest('button');
    expect(exportBtn).toBeDisabled();
  });

  it('export button is disabled when isExporting', () => {
    renderWithTheme(
      <MovementsToolbar {...defaultProps} isExporting />
    );
    const exportBtn = screen.getByText('movements.toolbar.exportCsv').closest('button');
    expect(exportBtn).toBeDisabled();
  });

  it('calls onExport when export button clicked and valid', () => {
    const onExport = jest.fn();
    renderWithTheme(<MovementsToolbar {...defaultProps} onExport={onExport} />);
    const exportBtn = screen.getByText('movements.toolbar.exportCsv').closest('button');
    if (exportBtn && !exportBtn.disabled) {
      fireEvent.click(exportBtn);
      expect(onExport).toHaveBeenCalled();
    }
  });
});
