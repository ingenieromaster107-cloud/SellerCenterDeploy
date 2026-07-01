import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { WizardShell } from './wizard-shell';

jest.mock('./styles', () => ({
  FORM_MAX_WIDTH: 480,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('WizardShell', () => {
  it('renders children', () => {
    renderWithTheme(
      <WizardShell>
        <div data-testid="child-1">Step content</div>
        <div data-testid="child-2">More content</div>
      </WizardShell>
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('renders text children', () => {
    renderWithTheme(<WizardShell>Hello wizard</WizardShell>);
    expect(screen.getByText('Hello wizard')).toBeInTheDocument();
  });

  it('renders container element', () => {
    const { container } = renderWithTheme(
      <WizardShell>
        <span>content</span>
      </WizardShell>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
