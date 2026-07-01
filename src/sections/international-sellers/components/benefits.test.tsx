import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Benefits from './benefits';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Benefits', () => {
  it('renders all 4 benefit blocks', () => {
    renderWithTheme(<Benefits />);
    expect(screen.getByText('No local entity required')).toBeInTheDocument();
    expect(screen.getByText('We manage customs')).toBeInTheDocument();
    expect(screen.getByText('Local fulfillment')).toBeInTheDocument();
    expect(screen.getByText('Customer support')).toBeInTheDocument();
  });

  it('renders 4 cards', () => {
    const { container } = renderWithTheme(<Benefits />);
    const cards = container.querySelectorAll('.MuiCard-root');
    expect(cards).toHaveLength(4);
  });
});
