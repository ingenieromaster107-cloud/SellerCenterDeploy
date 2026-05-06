import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ImportModeSelector } from './import-mode-selector';

const options = [
  { value: 'CREATE' as const, title: 'Crear', description: 'Crea productos nuevos.' },
  { value: 'UPDATE' as const, title: 'Actualizar', description: 'Actualiza por SKU.' },
  { value: 'REPLACE' as const, title: 'Reemplazar', description: 'Reemplaza completo.' },
];

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ImportModeSelector', () => {
  it('renders all options with title and description', () => {
    renderWithTheme(<ImportModeSelector value="CREATE" onChange={() => {}} options={options} />);
    expect(screen.getByText('Crear')).toBeInTheDocument();
    expect(screen.getByText('Crea productos nuevos.')).toBeInTheDocument();
    expect(screen.getByText('Actualizar')).toBeInTheDocument();
    expect(screen.getByText('Reemplazar')).toBeInTheDocument();
  });

  it('calls onChange with the selected mode when clicked', () => {
    const onChange = jest.fn();
    renderWithTheme(<ImportModeSelector value="CREATE" onChange={onChange} options={options} />);
    fireEvent.click(screen.getByText('Actualizar'));
    expect(onChange).toHaveBeenCalledWith('UPDATE');
  });

  it('marks the active option', () => {
    renderWithTheme(<ImportModeSelector value="UPDATE" onChange={() => {}} options={options} />);
    const radios = screen.getAllByRole('radio');
    const checked = radios.find((r) => (r as HTMLInputElement).checked);
    expect(checked).toBeDefined();
    expect((checked as HTMLInputElement).value).toBe('UPDATE');
  });

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn();
    renderWithTheme(
      <ImportModeSelector value="CREATE" onChange={onChange} options={options} disabled />
    );
    fireEvent.click(screen.getByText('Actualizar'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
