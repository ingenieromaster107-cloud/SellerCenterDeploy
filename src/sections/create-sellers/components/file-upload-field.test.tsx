import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { FileUploadField } from './file-upload-field';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/snackbar', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

jest.mock('./document-rules', () => ({
  ACCEPTED_MIME: 'application/pdf',
  MAX_FILE_SIZE: 5 * 1024 * 1024,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('FileUploadField', () => {
  it('renders label text', () => {
    renderWithTheme(
      <FileUploadField label="Certificado" file={null} onChange={jest.fn()} />
    );
    expect(screen.getByText('Certificado')).toBeInTheDocument();
  });

  it('renders upload button when no file selected', () => {
    renderWithTheme(
      <FileUploadField label="Doc" file={null} onChange={jest.fn()} />
    );
    expect(screen.getByText('createSellers.step3.selectPdf')).toBeInTheDocument();
  });

  it('renders file name when file is provided', () => {
    const file = new File(['content'], 'my-document.pdf', { type: 'application/pdf' });
    renderWithTheme(
      <FileUploadField label="Doc" file={file} onChange={jest.fn()} />
    );
    expect(screen.getByText('my-document.pdf')).toBeInTheDocument();
  });

  it('calls onChange(null) when remove button is clicked', () => {
    const onChange = jest.fn();
    const file = new File(['content'], 'my-document.pdf', { type: 'application/pdf' });
    renderWithTheme(
      <FileUploadField label="Doc" file={file} onChange={onChange} />
    );
    const removeBtn = screen.getByRole('button', {
      name: 'createSellers.step3.removeFile',
    });
    fireEvent.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('renders hint text when provided and no error', () => {
    renderWithTheme(
      <FileUploadField label="Doc" hint="Max 5MB" file={null} onChange={jest.fn()} />
    );
    expect(screen.getByText('Max 5MB')).toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    renderWithTheme(
      <FileUploadField label="Doc" file={null} onChange={jest.fn()} error="Required field" />
    );
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('does not render hint when error is present', () => {
    renderWithTheme(
      <FileUploadField
        label="Doc"
        hint="Max 5MB"
        file={null}
        onChange={jest.fn()}
        error="Required"
      />
    );
    expect(screen.queryByText('Max 5MB')).not.toBeInTheDocument();
  });
});
