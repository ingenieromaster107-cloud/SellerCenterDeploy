import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProfileCover } from './profile-cover';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.5)',
}));

const theme = createTheme({
  cssVariables: true,
  mixins: {
    bgGradient: () => ({}),
  },
} as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProfileCover', () => {
  it('renders name', () => {
    renderWithTheme(<ProfileCover name="Ana García" role="Vendedor" />);
    expect(screen.getByText('Ana García')).toBeInTheDocument();
  });

  it('renders role', () => {
    renderWithTheme(<ProfileCover name="Ana García" role="Vendedor" />);
    expect(screen.getByText('Vendedor')).toBeInTheDocument();
  });

  it('renders avatar with first letter of name', () => {
    renderWithTheme(<ProfileCover name="Ana García" role="Vendedor" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders avatar with src when avatarUrl is provided', () => {
    renderWithTheme(
      <ProfileCover name="Ana García" role="Vendedor" avatarUrl="https://example.com/avatar.jpg" />
    );
    const img = screen.getByRole('img', { name: 'Ana García' });
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders without crashing when name and role are undefined', () => {
    renderWithTheme(<ProfileCover />);
    expect(document.querySelector('.MuiBox-root')).toBeInTheDocument();
  });

  it('accepts custom sx prop', () => {
    const { container } = renderWithTheme(
      <ProfileCover name="Test" role="Role" sx={{ mt: 2 }} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
