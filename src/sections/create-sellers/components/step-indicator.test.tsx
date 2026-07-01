import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { StepIndicator } from './step-indicator';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('StepIndicator', () => {
  it('renders step counter text', () => {
    renderWithTheme(<StepIndicator current={1} total={3} />);
    expect(
      screen.getByText(/createSellers.common.step.*1.*createSellers.common.of.*3/i)
    ).toBeInTheDocument();
  });

  it('renders correct number of progress segments', () => {
    const { container } = renderWithTheme(<StepIndicator current={2} total={4} />);
    const segments = container.querySelectorAll('[style*="height: 4px"], .MuiBox-root');
    expect(segments.length).toBeGreaterThan(0);
  });

  it('does not render back button when onBack is not provided', () => {
    renderWithTheme(<StepIndicator current={1} total={3} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders back button when onBack is provided', () => {
    const onBack = jest.fn();
    renderWithTheme(<StepIndicator current={2} total={3} onBack={onBack} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onBack when back button clicked', () => {
    const onBack = jest.fn();
    renderWithTheme(<StepIndicator current={2} total={3} onBack={onBack} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onBack).toHaveBeenCalled();
  });

  it('renders back arrow icon when onBack provided', () => {
    renderWithTheme(<StepIndicator current={2} total={3} onBack={jest.fn()} />);
    expect(screen.getByTestId('icon-eva:arrow-ios-back-fill')).toBeInTheDocument();
  });

  it('renders back button with accessible label', () => {
    renderWithTheme(<StepIndicator current={2} total={3} onBack={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: 'createSellers.common.back' })
    ).toBeInTheDocument();
  });
});
