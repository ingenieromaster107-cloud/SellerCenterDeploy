import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderTableToolbar } from './order-table-toolbar';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, onChange }: any) => (
    <div>
      <label>{label}</label>
      <input
        data-testid={`datepicker-${label}`}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
    </div>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const makeFilters = (overrides = {}) => ({
  state: {
    name: '',
    startDate: null,
    endDate: null,
    ...overrides,
  },
  setState: jest.fn(),
});

describe('OrderTableToolbar', () => {
  it('renders search input', () => {
    const filters = makeFilters();
    renderWithTheme(
      <OrderTableToolbar filters={filters as any} onResetPage={jest.fn()} dateError={false} />
    );
    expect(
      screen.getByPlaceholderText('ordersModule.table.filters.search')
    ).toBeInTheDocument();
  });

  it('renders start date picker label', () => {
    const filters = makeFilters();
    renderWithTheme(
      <OrderTableToolbar filters={filters as any} onResetPage={jest.fn()} dateError={false} />
    );
    expect(screen.getByText('ordersModule.table.filters.initialDate')).toBeInTheDocument();
  });

  it('renders end date picker label', () => {
    const filters = makeFilters();
    renderWithTheme(
      <OrderTableToolbar filters={filters as any} onResetPage={jest.fn()} dateError={false} />
    );
    expect(screen.getByText('ordersModule.table.filters.finalDate')).toBeInTheDocument();
  });

  it('calls setState and onResetPage when name changes', () => {
    const onResetPage = jest.fn();
    const filters = makeFilters();
    renderWithTheme(
      <OrderTableToolbar filters={filters as any} onResetPage={onResetPage} dateError={false} />
    );
    const input = screen.getByPlaceholderText('ordersModule.table.filters.search');
    fireEvent.change(input, { target: { value: 'test order' } });
    expect(onResetPage).toHaveBeenCalled();
    expect(filters.setState).toHaveBeenCalledWith({ name: 'test order' });
  });

  it('calls setState and onResetPage when start date changes', () => {
    const onResetPage = jest.fn();
    const filters = makeFilters();
    renderWithTheme(
      <OrderTableToolbar filters={filters as any} onResetPage={onResetPage} dateError={false} />
    );
    const input = screen.getByTestId(
      'datepicker-ordersModule.table.filters.initialDate'
    );
    fireEvent.change(input, { target: { value: '2024-01-01' } });
    expect(onResetPage).toHaveBeenCalled();
    expect(filters.setState).toHaveBeenCalledWith({ startDate: '2024-01-01' });
  });

  it('calls setState and onResetPage when end date changes', () => {
    const onResetPage = jest.fn();
    const filters = makeFilters();
    renderWithTheme(
      <OrderTableToolbar filters={filters as any} onResetPage={onResetPage} dateError={false} />
    );
    const input = screen.getByTestId(
      'datepicker-ordersModule.table.filters.finalDate'
    );
    fireEvent.change(input, { target: { value: '2024-12-31' } });
    expect(onResetPage).toHaveBeenCalled();
    expect(filters.setState).toHaveBeenCalledWith({ endDate: '2024-12-31' });
  });

  it('renders with current name value in search input', () => {
    const filters = makeFilters({ name: 'my order' });
    renderWithTheme(
      <OrderTableToolbar filters={filters as any} onResetPage={jest.fn()} dateError={false} />
    );
    expect(screen.getByDisplayValue('my order')).toBeInTheDocument();
  });
});
