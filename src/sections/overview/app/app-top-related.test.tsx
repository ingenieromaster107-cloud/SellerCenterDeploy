import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppTopRelated } from './app-top-related';

jest.mock('minimal-shared/hooks', () => ({
  useTabs: (initial: string) => ({
    value: initial,
    onChange: jest.fn(),
  }),
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/utils/format-number', () => ({
  fData: (v: number) => `${v}MB`,
  fCurrency: (v: number) => `$${v}`,
  fShortenNumber: (v: number) => `short:${v}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const list = [
  {
    id: '1',
    name: 'App Estrella',
    size: 20,
    price: 0,
    shortcut: '/shortcuts/app1.svg',
    downloaded: 5000,
    ratingNumber: 4.5,
    totalReviews: 120,
  },
  {
    id: '2',
    name: 'Premium App',
    size: 50,
    price: 9.99,
    shortcut: '/shortcuts/app2.svg',
    downloaded: 1000,
    ratingNumber: 3.8,
    totalReviews: 45,
  },
];

describe('AppTopRelated', () => {
  it('renders title', () => {
    renderWithTheme(<AppTopRelated title="Más Relacionadas" list={list} />);
    expect(screen.getByText('Más Relacionadas')).toBeInTheDocument();
  });

  it('renders all app names', () => {
    renderWithTheme(<AppTopRelated list={list} />);
    expect(screen.getByText('App Estrella')).toBeInTheDocument();
    expect(screen.getByText('Premium App')).toBeInTheDocument();
  });

  it('shows Free label for price 0', () => {
    renderWithTheme(<AppTopRelated list={list} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows formatted price for paid app', () => {
    renderWithTheme(<AppTopRelated list={list} />);
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('renders period tabs', () => {
    renderWithTheme(<AppTopRelated list={list} />);
    expect(screen.getByText('Top 7 days')).toBeInTheDocument();
    expect(screen.getByText('Top 30 days')).toBeInTheDocument();
    expect(screen.getByText('All times')).toBeInTheDocument();
  });
});
