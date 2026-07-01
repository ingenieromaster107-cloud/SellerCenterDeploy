import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { EditTemplateModal } from './edit-template-modal';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/actions/chat-templates/use-update-template', () => ({
  useUpdateTemplate: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  Field: {
    Text: ({ name, label }: any) => <input data-testid={`field-${name}`} placeholder={label} />,
  },
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async () => ({ values: {}, errors: {} }),
}));

jest.mock('./create-template-modal', () => ({
  TemplateDataSchema: () => ({}),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const template: any = {
  entity_id: 1,
  title: 'Existing Title',
  content: 'Existing Content',
  is_active: 1,
  created_at: '2024-01-01',
};

describe('EditTemplateModal', () => {
  it('renders dialog when open', () => {
    renderWithTheme(<EditTemplateModal open onClose={jest.fn()} template={template} />);
    expect(screen.getByText('responseTemplates.editModal.title')).toBeInTheDocument();
  });

  it('does not render dialog content when closed', () => {
    renderWithTheme(<EditTemplateModal open={false} onClose={jest.fn()} template={template} />);
    expect(screen.queryByText('responseTemplates.editModal.title')).not.toBeInTheDocument();
  });

  it('renders title and content fields', () => {
    renderWithTheme(<EditTemplateModal open onClose={jest.fn()} template={template} />);
    expect(screen.getByTestId('field-title')).toBeInTheDocument();
    expect(screen.getByTestId('field-content')).toBeInTheDocument();
  });

  it('renders save button', () => {
    renderWithTheme(<EditTemplateModal open onClose={jest.fn()} template={template} />);
    expect(screen.getByText('responseTemplates.editModal.saveButton')).toBeInTheDocument();
  });
});
