import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MovementsEmpty } from './movements-empty';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/utils/format-time', () => ({
  fDate: (v: string) => `date:${v}`,
  FORMAT_PATTERNS: { paramCase: { date: 'YYYY-MM-DD' } },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('MovementsEmpty', () => {
  it('renders empty title', () => {
    renderWithTheme(<MovementsEmpty />);
    expect(screen.getByText('movements.empty.title')).toBeInTheDocument();
  });

  it('renders inbox icon', () => {
    renderWithTheme(<MovementsEmpty />);
    expect(screen.getByTestId('icon-solar:inbox-in-bold-duotone')).toBeInTheDocument();
  });

  it('renders generic description when no category filter', () => {
    renderWithTheme(<MovementsEmpty activeCategories={[]} />);
    expect(screen.getByText('movements.empty.description')).toBeInTheDocument();
  });

  it('renders filtered description when category filter active', () => {
    renderWithTheme(<MovementsEmpty activeCategories={['SALE'] as any} />);
    expect(screen.getByText('movements.empty.descriptionFiltered')).toBeInTheDocument();
  });

  it('renders period label when dateFrom and dateTo are provided', () => {
    renderWithTheme(
      <MovementsEmpty
        dateFrom="2024-01-01"
        dateTo="2024-01-31"
        activeCategories={[]}
      />
    );
    expect(screen.getByText(/movements.empty.periodLabel/)).toBeInTheDocument();
    expect(screen.getByText(/date:2024-01-01/)).toBeInTheDocument();
  });

  it('renders category names in period label when filter active', () => {
    renderWithTheme(
      <MovementsEmpty
        dateFrom="2024-01-01"
        dateTo="2024-01-31"
        activeCategories={['SALE', 'COMMISSION'] as any}
      />
    );
    expect(screen.getByText(/movements.empty.typeLabel/)).toBeInTheDocument();
  });

  it('renders hint text', () => {
    renderWithTheme(<MovementsEmpty />);
    expect(screen.getByText('movements.empty.hint')).toBeInTheDocument();
  });

  it('does not render period label when no dates', () => {
    renderWithTheme(<MovementsEmpty />);
    expect(screen.queryByText(/movements.empty.periodLabel/)).not.toBeInTheDocument();
  });
});
