import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import StartSelling from './start-selling';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('StartSelling', () => {
  it('renders START SELLING headline', () => {
    renderWithTheme(<StartSelling />);
    expect(screen.getByText(/START SELLING/)).toBeInTheDocument();
  });

  it('renders MITI-MITI description', () => {
    renderWithTheme(<StartSelling />);
    expect(screen.getByText(/MITI‑MITI® is an intelligent/)).toBeInTheDocument();
  });

  it('renders division image', () => {
    renderWithTheme(<StartSelling />);
    const img = screen.getByAltText('division');
    expect(img).toBeInTheDocument();
  });
});
