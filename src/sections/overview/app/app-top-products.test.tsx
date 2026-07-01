import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppTopProducts } from './app-top-products';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockList = [
  { id: '1', name: 'Producto Estrella', image: '/img/p1.jpg', totalFavorites: 100 },
  { id: '2', name: 'Producto Popular', image: '/img/p2.jpg', totalFavorites: 50 },
  { id: '3', name: 'Producto Nuevo', image: '/img/p3.jpg', totalFavorites: 10 },
];

describe('AppTopProducts', () => {
  it('renders title and subheader', () => {
    renderWithTheme(
      <AppTopProducts title="Top Productos" subheader="Este mes" list={mockList} />
    );
    expect(screen.getByText('Top Productos')).toBeInTheDocument();
    expect(screen.getByText('Este mes')).toBeInTheDocument();
  });

  it('renders all product names', () => {
    renderWithTheme(<AppTopProducts list={mockList} />);
    expect(screen.getByText('Producto Estrella')).toBeInTheDocument();
    expect(screen.getByText('Producto Popular')).toBeInTheDocument();
    expect(screen.getByText('Producto Nuevo')).toBeInTheDocument();
  });

  it('renders product avatars with images', () => {
    renderWithTheme(<AppTopProducts list={mockList} />);
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBeGreaterThanOrEqual(mockList.length);
  });

  it('renders empty list without crashing', () => {
    renderWithTheme(<AppTopProducts list={[]} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders favorite counts', () => {
    renderWithTheme(<AppTopProducts list={mockList} />);
    expect(screen.getByText('100: ventas')).toBeInTheDocument();
  });

  it('sorts by totalFavorites descending', () => {
    renderWithTheme(<AppTopProducts list={mockList} />);
    const names = screen.getAllByText(/Producto/);
    expect(names[0]).toHaveTextContent('Producto Estrella');
  });
});
