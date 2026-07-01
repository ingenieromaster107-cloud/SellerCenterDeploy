import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CommonTable } from './common-table';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/components/table', () => ({
  useTable: () => ({
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
    onResetPage: jest.fn(),
  }),
  TableNoData: ({ notFound }: any) =>
    notFound ? (
      <tr>
        <td data-testid="no-data">No data</td>
      </tr>
    ) : null,
  TableSkeleton: () => (
    <tr>
      <td data-testid="skeleton">Loading</td>
    </tr>
  ),
  TableHeadCustom: ({ headCells }: any) => (
    <thead>
      <tr>
        {headCells?.map((c: any, i: number) => (
          <th key={i}>{c.label}</th>
        ))}
      </tr>
    </thead>
  ),
  TablePaginationCustom: () => <div data-testid="pagination" />,
  getComparator: () => () => 0,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const tableHead = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
];

const tableData = [
  { name: 'Juan Pérez', email: 'juan@example.com' },
  { name: 'Ana García', email: 'ana@example.com' },
];

const renderCell = (row: any) => (
  <tr key={row.email}>
    <td>{row.name}</td>
    <td>{row.email}</td>
  </tr>
);

describe('CommonTable', () => {
  it('renders table headers', () => {
    renderWithTheme(
      <CommonTable
        tableHeadCell={tableHead}
        contentTable={tableData}
        renderCell={renderCell}
      />
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders all rows', () => {
    renderWithTheme(
      <CommonTable
        tableHeadCell={tableHead}
        contentTable={tableData}
        renderCell={renderCell}
      />
    );
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Ana García')).toBeInTheDocument();
  });

  it('renders pagination', () => {
    renderWithTheme(
      <CommonTable
        tableHeadCell={tableHead}
        contentTable={tableData}
        renderCell={renderCell}
      />
    );
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('renders search input when searchable', () => {
    renderWithTheme(
      <CommonTable
        tableHeadCell={tableHead}
        contentTable={tableData}
        renderCell={renderCell}
        searchable
        searchPlaceholder="Buscar..."
      />
    );
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('filters rows by search value', () => {
    renderWithTheme(
      <CommonTable
        tableHeadCell={tableHead}
        contentTable={tableData}
        renderCell={renderCell}
        searchable
        filterKeys={['name', 'email']}
      />
    );
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Ana' } });
    expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument();
    expect(screen.getByText('Ana García')).toBeInTheDocument();
  });

  it('shows no data when search has no results', () => {
    renderWithTheme(
      <CommonTable
        tableHeadCell={tableHead}
        contentTable={tableData}
        renderCell={renderCell}
        searchable
        filterKeys={['name']}
      />
    );
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'xyz-nonexistent' } });
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });

  it('renders empty table when no contentTable provided', () => {
    renderWithTheme(
      <CommonTable
        tableHeadCell={tableHead}
        renderCell={renderCell}
      />
    );
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    renderWithTheme(
      <CommonTable
        tableHeadCell={tableHead}
        contentTable={tableData}
        renderCell={renderCell}
      >
        <div data-testid="extra-content">Extra</div>
      </CommonTable>
    );
    expect(screen.getByTestId('extra-content')).toBeInTheDocument();
  });

  it('renders search icon', () => {
    renderWithTheme(
      <CommonTable
        tableHeadCell={tableHead}
        contentTable={tableData}
        renderCell={renderCell}
      />
    );
    expect(screen.getByTestId('icon-eva:search-fill')).toBeInTheDocument();
  });
});
