import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Footer from './footer';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Footer', () => {
  it('renders MITI-MITI logo image', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByAltText('MITI‑MITI')).toBeInTheDocument();
  });

  it('renders Dirección section', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText('Dirección')).toBeInTheDocument();
  });

  it('renders address text', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText(/26 Division St/)).toBeInTheDocument();
  });

  it('renders Contactanos section', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText('Contactanos')).toBeInTheDocument();
  });

  it('renders contact phone', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText(/\+57 310 784/)).toBeInTheDocument();
  });

  it('renders terms link', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText('Términos y condiciones')).toBeInTheDocument();
  });
});
