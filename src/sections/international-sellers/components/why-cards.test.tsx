import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import WhyCards from './why-cards';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('WhyCards', () => {
  it('renders section heading', () => {
    renderWithTheme(<WhyCards />);
    expect(screen.getByText('Why Sell With MITI‑MITI')).toBeInTheDocument();
  });

  it('renders 4 cards', () => {
    const { container } = renderWithTheme(<WhyCards />);
    const cards = container.querySelectorAll('.MuiCard-root');
    expect(cards).toHaveLength(4);
  });

  it('renders Enter Colombian Market item', () => {
    renderWithTheme(<WhyCards />);
    expect(screen.getByText(/Enter The Colombian/)).toBeInTheDocument();
  });
});
