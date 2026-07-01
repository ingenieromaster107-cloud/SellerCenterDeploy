import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { LoyaltySummaryCards } from './loyalty-summary-cards';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/utils/format-number', () => ({
  fNumber: (v: number) => `num:${v}`,
  fPercent: (v: number) => `pct:${v}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockSummary = {
  total_customers: 150,
  new_customers: 30,
  frequent_customers: 120,
  loyalty_rate: 0.8,
};

describe('LoyaltySummaryCards', () => {
  it('renders all 4 cards', () => {
    renderWithTheme(<LoyaltySummaryCards summary={mockSummary as any} isLoading={false} />);
    expect(screen.getByText('clientsModule.loyalty.cards.total')).toBeInTheDocument();
    expect(screen.getByText('clientsModule.loyalty.cards.new')).toBeInTheDocument();
    expect(screen.getByText('clientsModule.loyalty.cards.frequent')).toBeInTheDocument();
    expect(screen.getByText('clientsModule.loyalty.cards.loyaltyRate')).toBeInTheDocument();
  });

  it('renders formatted values', () => {
    renderWithTheme(<LoyaltySummaryCards summary={mockSummary as any} isLoading={false} />);
    expect(screen.getByText('num:150')).toBeInTheDocument();
    expect(screen.getByText('num:30')).toBeInTheDocument();
    expect(screen.getByText('num:120')).toBeInTheDocument();
    expect(screen.getByText('pct:0.8')).toBeInTheDocument();
  });

  it('renders skeleton instead of values when loading', () => {
    renderWithTheme(<LoyaltySummaryCards summary={mockSummary as any} isLoading />);
    expect(screen.queryByText('num:150')).not.toBeInTheDocument();
  });

  it('renders icons for each card', () => {
    renderWithTheme(<LoyaltySummaryCards summary={mockSummary as any} isLoading={false} />);
    expect(
      screen.getByTestId('icon-solar:users-group-rounded-bold-duotone')
    ).toBeInTheDocument();
    expect(screen.getByTestId('icon-solar:user-plus-bold')).toBeInTheDocument();
    expect(screen.getByTestId('icon-solar:heart-bold')).toBeInTheDocument();
    expect(screen.getByTestId('icon-solar:cup-star-bold')).toBeInTheDocument();
  });
});
