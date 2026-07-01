import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProfileTemplates } from './profile-templates';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/hooks/profile/use-chat-template', () => ({
  useChatTemplate: () => ({
    TABLE_HEAD: [{ id: 'name', label: 'Nombre' }],
    table: {
      page: 0,
      rowsPerPage: 10,
      order: 'asc',
      orderBy: 'name',
      selected: [],
      onSort: jest.fn(),
      onSelectRow: jest.fn(),
      onSelectAllRows: jest.fn(),
      onChangePage: jest.fn(),
      onChangeRowsPerPage: jest.fn(),
    },
    searchValue: '',
    setSearchValue: jest.fn(),
    statusTab: 'all',
    setStatusTab: jest.fn(),
    paginationModel: { page: 0, pageSize: 10 },
    setPaginationModel: jest.fn(),
    data: {
      interSellersMyResponseTemplates: {
        items: [],
        total_count: 0,
      },
    },
  }),
}));

jest.mock('./template-table', () => ({
  TemplateTable: () => <div data-testid="template-table" />,
}));

jest.mock('./create-template-modal', () => ({
  CreateTemplateModal: ({ onClose }: any) => (
    <div data-testid="create-modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProfileTemplates', () => {
  it('renders templates title', () => {
    renderWithTheme(<ProfileTemplates />);
    expect(screen.getByText('responseTemplates.title')).toBeInTheDocument();
  });

  it('renders add template button', () => {
    renderWithTheme(<ProfileTemplates />);
    expect(screen.getByText('responseTemplates.addButton')).toBeInTheDocument();
  });

  it('renders template table', () => {
    renderWithTheme(<ProfileTemplates />);
    expect(screen.getByTestId('template-table')).toBeInTheDocument();
  });

  it('opens create modal when add button clicked', () => {
    renderWithTheme(<ProfileTemplates />);
    const addButton = screen.getByText('responseTemplates.addButton');
    fireEvent.click(addButton);
    expect(screen.getByTestId('create-modal')).toBeInTheDocument();
  });

  it('closes modal when close is called', () => {
    renderWithTheme(<ProfileTemplates />);
    fireEvent.click(screen.getByText('responseTemplates.addButton'));
    expect(screen.getByTestId('create-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('create-modal')).not.toBeInTheDocument();
  });

  it('accepts className prop', () => {
    const { container } = renderWithTheme(<ProfileTemplates className="templates-class" />);
    expect(container.querySelector('.templates-class')).toBeInTheDocument();
  });
});
