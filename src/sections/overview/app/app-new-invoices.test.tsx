import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppNewInvoices } from './app-new-invoices';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('minimal-shared/hooks', () => ({
  usePopover: () => ({
    open: false,
    anchorEl: null,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('src/components/table', () => ({
  TableHeadCustom: ({ headCells }: any) => (
    <thead>
      <tr>
        {headCells.map((c: any) => (
          <th key={c.id}>{c.label}</th>
        ))}
      </tr>
    </thead>
  ),
}));

jest.mock('src/components/custom-popover', () => ({
  CustomPopover: () => null,
}));

jest.mock('src/utils/format-number', () => ({
  fCurrency: (v: number) => `$${v}`,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const headCells = [
  { id: 'invoice', label: '# Factura' },
  { id: 'customer', label: 'Cliente' },
  { id: 'date', label: 'Fecha' },
  { id: 'price', label: 'Precio' },
  { id: 'status', label: 'Estado' },
  { id: 'actions', label: '' },
];

const tableData = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    customer: 'Juan Pérez',
    date: '2024-01-15',
    price: 150000,
    status: 'Entregado',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    customer: 'Ana Gómez',
    date: '2024-01-16',
    price: 75000,
    status: 'Cancelado',
  },
];

describe('AppNewInvoices', () => {
  it('renders title and subheader', () => {
    renderWithTheme(
      <AppNewInvoices
        title="Últimas Facturas"
        subheader="Este mes"
        tableData={tableData}
        headCells={headCells}
      />
    );
    expect(screen.getByText('Últimas Facturas')).toBeInTheDocument();
    expect(screen.getByText('Este mes')).toBeInTheDocument();
  });

  it('renders invoice numbers', () => {
    renderWithTheme(
      <AppNewInvoices tableData={tableData} headCells={headCells} />
    );
    expect(screen.getByText('INV-001')).toBeInTheDocument();
    expect(screen.getByText('INV-002')).toBeInTheDocument();
  });

  it('renders customer names', () => {
    renderWithTheme(
      <AppNewInvoices tableData={tableData} headCells={headCells} />
    );
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Ana Gómez')).toBeInTheDocument();
  });

  it('renders formatted prices', () => {
    renderWithTheme(
      <AppNewInvoices tableData={tableData} headCells={headCells} />
    );
    expect(screen.getByText('$150000')).toBeInTheDocument();
    expect(screen.getByText('$75000')).toBeInTheDocument();
  });

  it('renders status labels', () => {
    renderWithTheme(
      <AppNewInvoices tableData={tableData} headCells={headCells} />
    );
    expect(screen.getByText('Entregado')).toBeInTheDocument();
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });

  it('renders view-all button', () => {
    renderWithTheme(
      <AppNewInvoices tableData={tableData} headCells={headCells} />
    );
    expect(screen.getByText('viewAll')).toBeInTheDocument();
  });

  it('renders empty table without crashing', () => {
    renderWithTheme(<AppNewInvoices tableData={[]} headCells={headCells} />);
    expect(document.body).toBeInTheDocument();
  });
});
