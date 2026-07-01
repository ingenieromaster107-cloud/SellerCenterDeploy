import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChatLayout } from './layout';

const theme = createTheme({
  cssVariables: true,
  customShadows: { card: '0 0 0 rgba(0,0,0,0)' },
} as any);

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const slots = {
  nav: <div data-testid="slot-nav">Nav</div>,
  header: <div data-testid="slot-header">Header</div>,
  main: <div data-testid="slot-main">Main</div>,
  details: <div data-testid="slot-details">Details</div>,
};

describe('ChatLayout', () => {
  it('renders nav slot', () => {
    renderWithTheme(<ChatLayout slots={slots} />);
    expect(screen.getByTestId('slot-nav')).toBeInTheDocument();
  });

  it('renders header slot', () => {
    renderWithTheme(<ChatLayout slots={slots} />);
    expect(screen.getByTestId('slot-header')).toBeInTheDocument();
  });

  it('renders main slot', () => {
    renderWithTheme(<ChatLayout slots={slots} />);
    expect(screen.getByTestId('slot-main')).toBeInTheDocument();
  });

  it('renders details slot', () => {
    renderWithTheme(<ChatLayout slots={slots} />);
    expect(screen.getByTestId('slot-details')).toBeInTheDocument();
  });

  it('renders all slots together', () => {
    renderWithTheme(<ChatLayout slots={slots} />);
    expect(screen.getByText('Nav')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});
