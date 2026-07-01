import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderTableFiltersResult } from './order-table-filters-results';

jest.mock('src/utils/format-time', () => ({
  fDateRangeShortLabel: (start: any, end: any) => `${start} - ${end}`,
}));

jest.mock('src/components/filters-result/filters-block', () => ({
  FiltersBlock: ({ label, isShow, children }: any) =>
    isShow ? (
      <div data-testid={`block-${label.trim().replace(':', '')}`}>
        <span>{label}</span>
        {children}
      </div>
    ) : null,
}));

jest.mock('src/components/filters-result/filters-result', () => ({
  FiltersResult: ({ totalResults, onReset, children }: any) => (
    <div data-testid="filters-result">
      <span data-testid="total">{totalResults}</span>
      <button type="button" onClick={onReset}>
        Reset
      </button>
      {children}
    </div>
  ),
  chipProps: {},
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const makeFilters = (overrides = {}) => ({
  state: { name: '', status: 'all', startDate: null, endDate: null, ...overrides },
  setState: jest.fn(),
  resetState: jest.fn(),
});

describe('OrderTableFiltersResult', () => {
  it('renders total results count', () => {
    renderWithTheme(
      <OrderTableFiltersResult
        filters={makeFilters()}
        totalResults={42}
        onResetPage={jest.fn()}
      />
    );
    expect(screen.getByTestId('total')).toHaveTextContent('42');
  });

  it('does not show status block when status is all', () => {
    renderWithTheme(
      <OrderTableFiltersResult
        filters={makeFilters({ status: 'all' })}
        totalResults={5}
        onResetPage={jest.fn()}
      />
    );
    expect(screen.queryByTestId('block-Status')).not.toBeInTheDocument();
  });

  it('shows status chip when status is not all', () => {
    renderWithTheme(
      <OrderTableFiltersResult
        filters={makeFilters({ status: 'Entregado' })}
        totalResults={3}
        onResetPage={jest.fn()}
      />
    );
    expect(screen.getByTestId('block-Status')).toBeInTheDocument();
    expect(screen.getByText('Entregado')).toBeInTheDocument();
  });

  it('shows keyword block when name is set', () => {
    renderWithTheme(
      <OrderTableFiltersResult
        filters={makeFilters({ name: 'ORD-123' })}
        totalResults={1}
        onResetPage={jest.fn()}
      />
    );
    expect(screen.getByTestId('block-Keyword')).toBeInTheDocument();
  });

  it('calls onResetPage and resetState when reset button clicked', () => {
    const onResetPage = jest.fn();
    const filters = makeFilters();
    renderWithTheme(
      <OrderTableFiltersResult
        filters={filters}
        totalResults={0}
        onResetPage={onResetPage}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onResetPage).toHaveBeenCalled();
    expect(filters.resetState).toHaveBeenCalled();
  });
});
