import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { SubAccountTableRow } from './table-row';

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span data-testid="label">{children}</span>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/custom-popover', () => ({
  CustomPopover: ({ open, children }: any) =>
    open ? <div data-testid="custom-popover">{children}</div> : null,
}));

const mockOnOpen = jest.fn();
jest.mock('minimal-shared/hooks', () => ({
  usePopover: () => ({
    open: false,
    anchorEl: null,
    onOpen: mockOnOpen,
    onClose: jest.fn(),
  }),
}));

const mockRow = {
  id: 142,
  name: 'Ana Garcia',
  email: 'ana@gmail.com',
  phone: '+57 310 555 0192',
  status: 'ACTIVE',
  createdAt: '2022-03-04',
  lastAccess: '2025-03-15T10:42:00Z',
  actions: ['editar', 'historial'],
  permissions: ['REPORTS', 'ORDERS'],
};

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <ThemeProvider theme={theme}>
      <table>
        <tbody>{ui}</tbody>
      </table>
    </ThemeProvider>
  );

describe('SubAccountTableRow', () => {
  it('renders account name', () => {
    renderWithTheme(
      <SubAccountTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/account/subaccount/142"
        onSelectRow={jest.fn()}
      />
    );
    expect(screen.getByText('Ana Garcia')).toBeInTheDocument();
  });

  it('renders account email', () => {
    renderWithTheme(
      <SubAccountTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/account/subaccount/142"
        onSelectRow={jest.fn()}
      />
    );
    expect(screen.getByText('ana@gmail.com')).toBeInTheDocument();
  });

  it('renders permission labels', () => {
    renderWithTheme(
      <SubAccountTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/account/subaccount/142"
        onSelectRow={jest.fn()}
      />
    );
    const labels = screen.getAllByTestId('label');
    const labelTexts = labels.map((l) => l.textContent);
    expect(labelTexts).toContain('Reports');
    expect(labelTexts).toContain('Orders');
  });

  it('renders status label', () => {
    renderWithTheme(
      <SubAccountTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/account/subaccount/142"
        onSelectRow={jest.fn()}
      />
    );
    const labels = screen.getAllByTestId('label');
    const labelTexts = labels.map((l) => l.textContent);
    expect(labelTexts).toContain('Active');
  });

  it('renders more actions button', () => {
    renderWithTheme(
      <SubAccountTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/account/subaccount/142"
        onSelectRow={jest.fn()}
      />
    );
    expect(screen.getByTestId('icon-eva:more-vertical-fill')).toBeInTheDocument();
  });

  it('calls onOpen when more actions button clicked', () => {
    renderWithTheme(
      <SubAccountTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/account/subaccount/142"
        onSelectRow={jest.fn()}
      />
    );
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(mockOnOpen).toHaveBeenCalled();
  });
});
