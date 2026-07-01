import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CreateTemplateModal } from './create-template-modal';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/actions/chat-templates/use-create-template', () => ({
  useCreateTemplate: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  Field: {
    Text: ({ name, label }: any) => <input data-testid={`field-${name}`} placeholder={label} />,
  },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('CreateTemplateModal', () => {
  it('renders dialog when open', () => {
    renderWithTheme(<CreateTemplateModal modalState onClose={jest.fn()} />);
    expect(screen.getByText('responseTemplates.createModal.title')).toBeInTheDocument();
  });

  it('does not show dialog content when closed', () => {
    renderWithTheme(<CreateTemplateModal modalState={false} onClose={jest.fn()} />);
    expect(screen.queryByText('responseTemplates.createModal.title')).not.toBeInTheDocument();
  });

  it('renders title and content fields', () => {
    renderWithTheme(<CreateTemplateModal modalState onClose={jest.fn()} />);
    expect(screen.getByTestId('field-title')).toBeInTheDocument();
    expect(screen.getByTestId('field-content')).toBeInTheDocument();
  });

  it('renders save button', () => {
    renderWithTheme(<CreateTemplateModal modalState onClose={jest.fn()} />);
    expect(screen.getByText('responseTemplates.createModal.saveButton')).toBeInTheDocument();
  });
});
