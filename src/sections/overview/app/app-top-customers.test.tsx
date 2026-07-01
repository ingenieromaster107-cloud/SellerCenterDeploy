import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppTopCustomers } from './app-top-customers';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const list = [
  { id: '1', name: 'Ana García', email: 'ana@test.com' },
  { id: '2', name: 'Carlos Ruiz', email: 'carlos@test.com' },
  { id: '3', name: 'María López', email: 'maria@test.com' },
];

describe('AppTopCustomers', () => {
  it('renders title', () => {
    renderWithTheme(<AppTopCustomers title="Top Clientes" list={list} />);
    expect(screen.getByText('Top Clientes')).toBeInTheDocument();
  });

  it('renders all customer names', () => {
    renderWithTheme(<AppTopCustomers list={list} />);
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
    expect(screen.getByText('María López')).toBeInTheDocument();
  });

  it('renders customer emails', () => {
    renderWithTheme(<AppTopCustomers list={list} />);
    expect(screen.getByText('ana@test.com')).toBeInTheDocument();
    expect(screen.getByText('carlos@test.com')).toBeInTheDocument();
  });

  it('renders empty list without crashing', () => {
    renderWithTheme(<AppTopCustomers list={[]} />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders subheader when provided', () => {
    renderWithTheme(
      <AppTopCustomers title="Clientes" subheader="Mes actual" list={list} />
    );
    expect(screen.getByText('Mes actual')).toBeInTheDocument();
  });
});
