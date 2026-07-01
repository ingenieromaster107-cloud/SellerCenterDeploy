import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MovementsSummaryCards } from './movements-summary';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/utils/format-number', () => ({
  fCurrencyCop: (v: number) => `COP ${v}`,
}));

jest.mock('../constants', () => ({
  MOVEMENT_CATEGORY: {
    SALE: 'SALE',
    COMMISSION: 'COMMISSION',
    REFUND: 'REFUND',
  },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockSummary = {
  seller_id: 1,
  date_from: '2026-06-01',
  date_to: '2026-06-22',
  gross_sales: 500000,
  total_commissions: 50000,
  total_refunds: 10000,
  net_seller: 440000,
  movements_count: 25,
};

describe('MovementsSummaryCards', () => {
  it('renders all four cards', () => {
    renderWithTheme(
      <MovementsSummaryCards
        summary={mockSummary}
        isLoading={false}
        activeCategories={[]}
        onToggleCategory={jest.fn()}
      />
    );
    expect(screen.getByText('movements.summary.grossSales')).toBeInTheDocument();
    expect(screen.getByText('movements.summary.totalCommissions')).toBeInTheDocument();
    expect(screen.getByText('movements.summary.totalRefunds')).toBeInTheDocument();
    expect(screen.getByText('movements.summary.netSeller')).toBeInTheDocument();
  });

  it('renders formatted values', () => {
    renderWithTheme(
      <MovementsSummaryCards
        summary={mockSummary}
        isLoading={false}
        activeCategories={[]}
        onToggleCategory={jest.fn()}
      />
    );
    expect(screen.getByText('COP 500000')).toBeInTheDocument();
    expect(screen.getByText('COP 50000')).toBeInTheDocument();
    expect(screen.getByText('COP 10000')).toBeInTheDocument();
    expect(screen.getByText('COP 440000')).toBeInTheDocument();
  });

  it('renders skeleton when loading', () => {
    renderWithTheme(
      <MovementsSummaryCards
        summary={undefined}
        isLoading
        activeCategories={[]}
        onToggleCategory={jest.fn()}
      />
    );
    expect(screen.queryByText('COP 0')).not.toBeInTheDocument();
  });

  it('renders zero values when summary is undefined', () => {
    renderWithTheme(
      <MovementsSummaryCards
        summary={undefined}
        isLoading={false}
        activeCategories={[]}
        onToggleCategory={jest.fn()}
      />
    );
    expect(screen.getAllByText('COP 0')).toHaveLength(4);
  });

  it('calls onToggleCategory when clicking a category card', () => {
    const onToggleCategory = jest.fn();
    renderWithTheme(
      <MovementsSummaryCards
        summary={mockSummary}
        isLoading={false}
        activeCategories={[]}
        onToggleCategory={onToggleCategory}
      />
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onToggleCategory).toHaveBeenCalledWith('SALE');
  });

  it('shows active state for active categories', () => {
    renderWithTheme(
      <MovementsSummaryCards
        summary={mockSummary}
        isLoading={false}
        activeCategories={['SALE'] as any}
        onToggleCategory={jest.fn()}
      />
    );
    const salesCard = screen.getAllByRole('button')[0];
    expect(salesCard).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows inactive state for inactive categories', () => {
    renderWithTheme(
      <MovementsSummaryCards
        summary={mockSummary}
        isLoading={false}
        activeCategories={[]}
        onToggleCategory={jest.fn()}
      />
    );
    const salesCard = screen.getAllByRole('button')[0];
    expect(salesCard).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onToggleCategory on keyboard Enter', () => {
    const onToggleCategory = jest.fn();
    renderWithTheme(
      <MovementsSummaryCards
        summary={mockSummary}
        isLoading={false}
        activeCategories={[]}
        onToggleCategory={onToggleCategory}
      />
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.keyDown(buttons[0], { key: 'Enter' });
    expect(onToggleCategory).toHaveBeenCalledWith('SALE');
  });

  it('calls onToggleCategory on keyboard Space', () => {
    const onToggleCategory = jest.fn();
    renderWithTheme(
      <MovementsSummaryCards
        summary={mockSummary}
        isLoading={false}
        activeCategories={[]}
        onToggleCategory={onToggleCategory}
      />
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.keyDown(buttons[0], { key: ' ' });
    expect(onToggleCategory).toHaveBeenCalledWith('SALE');
  });
});
