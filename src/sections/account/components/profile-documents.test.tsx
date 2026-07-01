import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProfileDocuments } from './profile-documents';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProfileDocuments', () => {
  it('renders without crashing', () => {
    renderWithTheme(<ProfileDocuments />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders terms checkbox', () => {
    renderWithTheme(<ProfileDocuments />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderWithTheme(<ProfileDocuments />);
    const button = screen.getByRole('button', {
      name: /formPlaceholder\.btnRegister/i,
    });
    expect(button).toBeDefined();
  });

  it('accepts className prop', () => {
    const { container } = renderWithTheme(<ProfileDocuments className="test-docs" />);
    expect(container.querySelector('.test-docs')).toBeInTheDocument();
  });

  it('can toggle terms checkbox', () => {
    renderWithTheme(<ProfileDocuments />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
