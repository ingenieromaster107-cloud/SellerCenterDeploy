import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { PromotionTableToolbar } from './promotion-table-toolbar';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('PromotionTableToolbar', () => {
  it('renders search input', () => {
    renderWithTheme(
      <PromotionTableToolbar
        searchValue=""
        onSearchChange={jest.fn()}
        statusFilter="all"
        onStatusChange={jest.fn()}
      />
    );
    expect(
      screen.getByPlaceholderText('promotionsModule.table.searchFilter')
    ).toBeInTheDocument();
  });

  it('shows current search value', () => {
    renderWithTheme(
      <PromotionTableToolbar
        searchValue="descuento"
        onSearchChange={jest.fn()}
        statusFilter="all"
        onStatusChange={jest.fn()}
      />
    );
    expect(screen.getByDisplayValue('descuento')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in search', () => {
    const onSearchChange = jest.fn();
    renderWithTheme(
      <PromotionTableToolbar
        searchValue=""
        onSearchChange={onSearchChange}
        statusFilter="all"
        onStatusChange={jest.fn()}
      />
    );
    const input = screen.getByPlaceholderText('promotionsModule.table.searchFilter');
    fireEvent.change(input, { target: { value: 'promo' } });
    expect(onSearchChange).toHaveBeenCalledWith('promo');
  });

  it('renders status select', () => {
    renderWithTheme(
      <PromotionTableToolbar
        searchValue=""
        onSearchChange={jest.fn()}
        statusFilter="all"
        onStatusChange={jest.fn()}
      />
    );
    const matches = screen.getAllByText('promotionsModule.table.columns.status');
    expect(matches.length).toBeGreaterThan(0);
  });

  it('renders search icon', () => {
    renderWithTheme(
      <PromotionTableToolbar
        searchValue=""
        onSearchChange={jest.fn()}
        statusFilter="all"
        onStatusChange={jest.fn()}
      />
    );
    expect(screen.getByTestId('icon-eva:search-fill')).toBeInTheDocument();
  });
});
