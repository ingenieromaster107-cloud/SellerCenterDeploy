import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Features from './features';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Features', () => {
  it('renders all feature items', () => {
    renderWithTheme(<Features />);
    expect(screen.getByText('Direct Access To The Colombian Market')).toBeInTheDocument();
    expect(screen.getByText(/No need to manage customs/)).toBeInTheDocument();
    expect(screen.getByText(/End-to-end order fulfillment/)).toBeInTheDocument();
  });

  it('renders 3 cards', () => {
    const { container } = renderWithTheme(<Features />);
    const cards = container.querySelectorAll('.MuiCard-root');
    expect(cards).toHaveLength(3);
  });
});
