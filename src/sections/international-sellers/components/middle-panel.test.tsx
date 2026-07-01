import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import MiddlePanel from './middle-panel';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('MiddlePanel', () => {
  it('renders without crashing', () => {
    renderWithTheme(<MiddlePanel />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders MITI-MITI Manages label', () => {
    renderWithTheme(<MiddlePanel />);
    expect(screen.getByText('MITI‑MITI® Manages:')).toBeInTheDocument();
  });

  it('renders customs clearance item', () => {
    renderWithTheme(<MiddlePanel />);
    expect(screen.getByText(/Colombian customs clearance/)).toBeInTheDocument();
  });

  it('renders shipping item', () => {
    renderWithTheme(<MiddlePanel />);
    expect(screen.getByText(/International shipping/)).toBeInTheDocument();
  });

  it('renders service description', () => {
    renderWithTheme(<MiddlePanel />);
    expect(screen.getByText(/We provide our customer/)).toBeInTheDocument();
  });
});
