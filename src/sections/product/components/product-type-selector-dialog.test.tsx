import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProductTypeSelectorDialog } from './product-type-selector-dialog';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (_ns: string, key: string) => key,
  }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProductTypeSelectorDialog', () => {
  it('renders dialog title when open', () => {
    renderWithTheme(
      <ProductTypeSelectorDialog open onClose={jest.fn()} onSelect={jest.fn()} />
    );
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    renderWithTheme(
      <ProductTypeSelectorDialog open={false} onClose={jest.fn()} onSelect={jest.fn()} />
    );
    expect(screen.queryByText('title')).not.toBeInTheDocument();
  });

  it('renders both product type options', () => {
    renderWithTheme(
      <ProductTypeSelectorDialog open onClose={jest.fn()} onSelect={jest.fn()} />
    );
    expect(screen.getByText('simpleTitle')).toBeInTheDocument();
    expect(screen.getByText('configurableTitle')).toBeInTheDocument();
  });

  it('renders descriptions for both options', () => {
    renderWithTheme(
      <ProductTypeSelectorDialog open onClose={jest.fn()} onSelect={jest.fn()} />
    );
    expect(screen.getByText('simpleDescription')).toBeInTheDocument();
    expect(screen.getByText('configurableDescription')).toBeInTheDocument();
  });

  it('calls onSelect with "simple" when simple option is clicked', () => {
    const onSelect = jest.fn();
    renderWithTheme(
      <ProductTypeSelectorDialog open onClose={jest.fn()} onSelect={onSelect} />
    );
    fireEvent.click(screen.getByText('simpleTitle').closest('[class*="MuiCard"]')!);
    expect(onSelect).toHaveBeenCalledWith('simple');
  });

  it('calls onSelect with "configurable" when configurable option is clicked', () => {
    const onSelect = jest.fn();
    renderWithTheme(
      <ProductTypeSelectorDialog open onClose={jest.fn()} onSelect={onSelect} />
    );
    fireEvent.click(screen.getByText('configurableTitle').closest('[class*="MuiCard"]')!);
    expect(onSelect).toHaveBeenCalledWith('configurable');
  });
});
