import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { TemplateTable } from './template-table';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components', () => ({
  TableHeadCustom: () => <thead data-testid="table-head" />,
  TablePaginationCustom: ({ count }: any) => (
    <div data-testid="pagination" data-count={count} />
  ),
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-icon={icon} />,
}));

jest.mock('src/components/custom-dialog', () => ({
  ConfirmDialog: () => null,
}));

jest.mock('src/actions/chat-templates/use-delete-template', () => ({
  useDeleteTemplate: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock('src/actions/chat-templates/use-update-template', () => ({
  useUpdateTemplate: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock('./edit-template-modal', () => ({
  EditTemplateModal: () => null,
}));

jest.mock('./template-table-toolbar', () => ({
  TemplateTableToolbar: ({ searchValue, onSearchChange }: any) => (
    <div data-testid="toolbar">
      <input
        data-testid="search-input"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const tableHead = [
  { id: 'title', label: 'Title' },
  { id: 'content', label: 'Content' },
];

const tableData: any[] = [
  { entity_id: 1, title: 'Template A', content: 'Content A', is_active: 1, created_at: '2024-01-01' },
  { entity_id: 2, title: 'Template B', content: 'Content B', is_active: 0, created_at: '2024-02-01' },
];

const makeProps = (overrides: any = {}) => ({
  tableData,
  tableHead,
  searchValue: '',
  setSearchValue: jest.fn(),
  statusTab: 'all' as const,
  setStatusTab: jest.fn(),
  paginationModel: { page: 0, pageSize: 10 },
  setPaginationModel: jest.fn(),
  table: { order: 'asc', orderBy: 'title', onSort: jest.fn(), onChangeDense: jest.fn() },
  ...overrides,
});

describe('TemplateTable', () => {
  it('renders toolbar', () => {
    renderWithTheme(<TemplateTable {...makeProps()} />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('renders all rows when statusTab is all', () => {
    renderWithTheme(<TemplateTable {...makeProps()} />);
    expect(screen.getByText('Template A')).toBeInTheDocument();
    expect(screen.getByText('Template B')).toBeInTheDocument();
  });

  it('shows only active rows when statusTab is ACTIVE', () => {
    renderWithTheme(<TemplateTable {...makeProps({ statusTab: 'ACTIVE' })} />);
    expect(screen.getByText('Template A')).toBeInTheDocument();
    expect(screen.queryByText('Template B')).not.toBeInTheDocument();
  });

  it('shows only inactive rows when statusTab is INACTIVE', () => {
    renderWithTheme(<TemplateTable {...makeProps({ statusTab: 'INACTIVE' })} />);
    expect(screen.queryByText('Template A')).not.toBeInTheDocument();
    expect(screen.getByText('Template B')).toBeInTheDocument();
  });

  it('filters rows by search value', () => {
    renderWithTheme(<TemplateTable {...makeProps({ searchValue: 'template a' })} />);
    expect(screen.getByText('Template A')).toBeInTheDocument();
    expect(screen.queryByText('Template B')).not.toBeInTheDocument();
  });

  it('renders pagination with filtered count', () => {
    renderWithTheme(<TemplateTable {...makeProps()} />);
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveAttribute('data-count', '2');
  });

  it('renders empty table when no rows match search', () => {
    renderWithTheme(<TemplateTable {...makeProps({ searchValue: 'zzz-no-match' })} />);
    expect(screen.queryByText('Template A')).not.toBeInTheDocument();
    expect(screen.queryByText('Template B')).not.toBeInTheDocument();
  });
});
