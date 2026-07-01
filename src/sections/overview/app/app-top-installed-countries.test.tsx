import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppTopInstalledCountries } from './app-top-installed-countries';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/flag-icon', () => ({
  FlagIcon: ({ code }: any) => <img alt={`flag-${code}`} src={`/flags/${code}.png`} />,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/utils/format-number', () => ({
  fShortenNumber: (v: number) => `short:${v}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const list = [
  { id: '1', countryCode: 'CO', countryName: 'Colombia', apple: 1200, android: 5400, windows: 300 },
  { id: '2', countryCode: 'MX', countryName: 'México', apple: 800, android: 3200, windows: 200 },
];

describe('AppTopInstalledCountries', () => {
  it('renders title', () => {
    renderWithTheme(
      <AppTopInstalledCountries title="Top Países" list={list} />
    );
    expect(screen.getByText('Top Países')).toBeInTheDocument();
  });

  it('renders country names', () => {
    renderWithTheme(<AppTopInstalledCountries list={list} />);
    expect(screen.getByText('Colombia')).toBeInTheDocument();
    expect(screen.getByText('México')).toBeInTheDocument();
  });

  it('renders flag icons', () => {
    renderWithTheme(<AppTopInstalledCountries list={list} />);
    expect(screen.getByAltText('flag-CO')).toBeInTheDocument();
    expect(screen.getByAltText('flag-MX')).toBeInTheDocument();
  });

  it('renders platform icons for each country', () => {
    renderWithTheme(<AppTopInstalledCountries list={list} />);
    const androidIcons = screen.getAllByTestId('icon-mingcute:android-2-fill');
    expect(androidIcons.length).toBe(list.length);
  });

  it('renders empty list without crashing', () => {
    renderWithTheme(<AppTopInstalledCountries list={[]} />);
    expect(document.body).toBeInTheDocument();
  });
});
