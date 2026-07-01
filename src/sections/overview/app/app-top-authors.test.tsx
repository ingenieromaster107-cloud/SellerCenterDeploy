import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppTopAuthors } from './app-top-authors';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.08)',
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/utils/format-number', () => ({
  fShortenNumber: (v: number) => `short:${v}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const list = [
  { id: '1', name: 'Autor Popular', avatarUrl: '/a1.jpg', totalFavorites: 300 },
  { id: '2', name: 'Segundo Autor', avatarUrl: '/a2.jpg', totalFavorites: 150 },
  { id: '3', name: 'Tercer Autor', avatarUrl: '/a3.jpg', totalFavorites: 50 },
];

describe('AppTopAuthors', () => {
  it('renders title and subheader', () => {
    renderWithTheme(
      <AppTopAuthors title="Top Autores" subheader="Este mes" list={list} />
    );
    expect(screen.getByText('Top Autores')).toBeInTheDocument();
    expect(screen.getByText('Este mes')).toBeInTheDocument();
  });

  it('renders all author names', () => {
    renderWithTheme(<AppTopAuthors list={list} />);
    expect(screen.getByText('Autor Popular')).toBeInTheDocument();
    expect(screen.getByText('Segundo Autor')).toBeInTheDocument();
    expect(screen.getByText('Tercer Autor')).toBeInTheDocument();
  });

  it('renders formatted favorite counts', () => {
    renderWithTheme(<AppTopAuthors list={list} />);
    expect(screen.getByText('short:300')).toBeInTheDocument();
  });

  it('renders heart icons for each author', () => {
    renderWithTheme(<AppTopAuthors list={list} />);
    const hearts = screen.getAllByTestId('icon-solar:heart-bold');
    expect(hearts.length).toBe(list.length);
  });

  it('sorts by totalFavorites descending', () => {
    renderWithTheme(<AppTopAuthors list={list} />);
    const names = screen.getAllByText(/Autor|Segundo|Tercer/);
    expect(names[0]).toHaveTextContent('Autor Popular');
  });

  it('renders empty list without crashing', () => {
    renderWithTheme(<AppTopAuthors list={[]} />);
    expect(document.body).toBeInTheDocument();
  });
});
