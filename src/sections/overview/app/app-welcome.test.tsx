import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppWelcome } from './app-welcome';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.88)',
}));

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

const theme = createTheme({
  cssVariables: true,
  mixins: { bgGradient: () => ({}) },
} as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AppWelcome', () => {
  it('renders title', () => {
    renderWithTheme(<AppWelcome title="Bienvenido, Juan!" />);
    expect(screen.getByText('Bienvenido, Juan!')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderWithTheme(
      <AppWelcome title="Título" description="Este es el panel de control." />
    );
    expect(screen.getByText('Este es el panel de control.')).toBeInTheDocument();
  });

  it('renders action node when provided', () => {
    renderWithTheme(
      <AppWelcome
        title="Título"
        action={<button type="button">Ver más</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Ver más' })).toBeInTheDocument();
  });

  it('renders img node when provided', () => {
    renderWithTheme(
      <AppWelcome
        title="Título"
        img={<img src="/test.png" alt="banner" />}
      />
    );
    expect(screen.getByAltText('banner')).toBeInTheDocument();
  });

  it('renders without crashing when no props provided', () => {
    renderWithTheme(<AppWelcome />);
    expect(document.body).toBeInTheDocument();
  });
});
