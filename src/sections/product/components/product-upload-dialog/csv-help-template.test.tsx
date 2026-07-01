import { render, screen } from '@testing-library/react';

import { CsvHelpTemplate } from './csv-help-template';

describe('CsvHelpTemplate', () => {
  it('renders hint text', () => {
    render(<CsvHelpTemplate />);
    expect(screen.getByText(/No sabes cómo llenar/i)).toBeInTheDocument();
  });

  it('renders a link to the instructions page', () => {
    render(<CsvHelpTemplate />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home/product/product-instructions');
  });

  it('link opens in a new tab', () => {
    render(<CsvHelpTemplate />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
