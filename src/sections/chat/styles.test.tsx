import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ToggleButton, CollapseButton } from './styles';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({
  cssVariables: true,
  customShadows: { primary: '0 4px 8px rgba(0,0,0,0.2)', z8: '0 8px 16px rgba(0,0,0,0.16)' },
} as any);

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('CollapseButton', () => {
  it('renders children', () => {
    renderWithTheme(<CollapseButton>Section Name</CollapseButton>);
    expect(screen.getByText('Section Name')).toBeInTheDocument();
  });

  it('renders downward arrow when selected', () => {
    renderWithTheme(<CollapseButton selected>Open</CollapseButton>);
    expect(
      screen.getByTestId('icon-eva:arrow-ios-downward-fill')
    ).toBeInTheDocument();
  });

  it('renders forward arrow when not selected', () => {
    renderWithTheme(<CollapseButton>Closed</CollapseButton>);
    expect(
      screen.getByTestId('icon-eva:arrow-ios-forward-fill')
    ).toBeInTheDocument();
  });

  it('renders forward arrow when disabled even if selected', () => {
    renderWithTheme(
      <CollapseButton selected disabled>
        Disabled
      </CollapseButton>
    );
    expect(
      screen.getByTestId('icon-eva:arrow-ios-forward-fill')
    ).toBeInTheDocument();
  });
});

describe('ToggleButton', () => {
  it('renders without crashing', () => {
    renderWithTheme(<ToggleButton />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    renderWithTheme(<ToggleButton><span>›</span></ToggleButton>);
    expect(screen.getByText('›')).toBeInTheDocument();
  });
});
