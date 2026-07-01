import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { TemplateTableToolbar } from './template-table-toolbar';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const defaultProps = {
  searchValue: '',
  onSearchChange: jest.fn(),
  statusFilter: 'all' as const,
  onStatusChange: jest.fn(),
};

describe('TemplateTableToolbar', () => {
  it('renders search input with placeholder', () => {
    renderWithTheme(<TemplateTableToolbar {...defaultProps} />);
    expect(screen.getByPlaceholderText('responseTemplates.searchFilter')).toBeInTheDocument();
  });

  it('displays current search value', () => {
    renderWithTheme(<TemplateTableToolbar {...defaultProps} searchValue="hello" />);
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });

  it('calls onSearchChange when search input changes', () => {
    const onSearchChange = jest.fn();
    renderWithTheme(
      <TemplateTableToolbar {...defaultProps} onSearchChange={onSearchChange} />
    );
    const input = screen.getByPlaceholderText('responseTemplates.searchFilter');
    fireEvent.change(input, { target: { value: 'new search' } });
    expect(onSearchChange).toHaveBeenCalledWith('new search');
  });

  it('renders status label', () => {
    renderWithTheme(<TemplateTableToolbar {...defaultProps} />);
    const labels = screen.getAllByText('responseTemplates.statusLabel');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('renders search icon', () => {
    renderWithTheme(<TemplateTableToolbar {...defaultProps} />);
    const icon = screen.getByTestId('iconify');
    expect(icon).toHaveAttribute('data-icon', 'eva:search-fill');
  });
});
