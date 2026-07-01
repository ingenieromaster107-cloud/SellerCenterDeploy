import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import HowItWorks from './how-it-works';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('HowItWorks', () => {
  it('renders section heading', () => {
    renderWithTheme(<HowItWorks />);
    expect(screen.getByText('How MITI‑MITI® Works')).toBeInTheDocument();
  });

  it('renders REGISTER AS text', () => {
    renderWithTheme(<HowItWorks />);
    expect(screen.getByText('REGISTER AS')).toBeInTheDocument();
  });

  it('renders WE SELL IN text', () => {
    renderWithTheme(<HowItWorks />);
    expect(screen.getByText('WE SELL IN')).toBeInTheDocument();
  });

  it('renders COLOMBIA text', () => {
    renderWithTheme(<HowItWorks />);
    expect(screen.getByText('COLOMBIA')).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    renderWithTheme(<HowItWorks />);
    expect(screen.getByText(/Submit your company information/)).toBeInTheDocument();
  });

  it('renders 3 step images', () => {
    const { container } = renderWithTheme(<HowItWorks />);
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBe(3);
  });
});
