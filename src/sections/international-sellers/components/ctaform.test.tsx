import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import CTAForm from './ctaform';

jest.mock('src/components/snackbar', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('CTAForm', () => {
  it('renders without crashing', () => {
    renderWithTheme(<CTAForm />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders Focus on your products tagline', () => {
    renderWithTheme(<CTAForm />);
    expect(screen.getByText('Focus on your products. We handle the rest.')).toBeInTheDocument();
  });

  it('renders form input fields', () => {
    renderWithTheme(<CTAForm />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(3);
  });

  it('renders consent checkbox', () => {
    renderWithTheme(<CTAForm />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('can toggle consent checkbox', () => {
    renderWithTheme(<CTAForm />);
    const checkboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = checkboxes[0];
    expect(firstCheckbox).not.toBeChecked();
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();
  });
});
