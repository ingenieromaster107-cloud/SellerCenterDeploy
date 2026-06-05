import type { SellerPromotionDataRaw } from 'src/interfaces/promotions';

import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { PromotionTableRow } from './promotion-table-row';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (_ns: string, key?: string) => key ?? _ns,
    currentLang: 'es',
  }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children, color }: any) => <span data-testid="label" data-color={color}>{children}</span>,
}));

jest.mock('src/utils/format-time', () => ({
  fDate: (d: string) => d,
}));

const baseRow: SellerPromotionDataRaw = {
  entity_id: 10,
  name: 'Test Promo',
  discount_type: 'BY_PERCENT',
  apply_type: 'AUTOMATIC',
  discount_amount: 15,
  from_date: '2026-06-01',
  to_date: '2026-12-31',
  budget_spent: 0,
  uses_per_customer: 1,
  times_used: 3,
  applies_to_all_products: true,
  status: 'ACTIVE',
};

const defaultProps = {
  row: baseRow,
  onView: jest.fn(),
  onEdit: jest.fn(),
  onPause: jest.fn(),
  onActivate: jest.fn(),
  onDelete: jest.fn(),
};

const theme = createTheme({ cssVariables: true });
const renderRow = (props = defaultProps) =>
  render(
    <ThemeProvider theme={theme}>
      <table>
        <tbody>
          <PromotionTableRow {...props} />
        </tbody>
      </table>
    </ThemeProvider>
  );

describe('PromotionTableRow', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the promotion name', () => {
    renderRow();
    expect(screen.getByText('Test Promo')).toBeInTheDocument();
  });

  it('renders the discount percentage', () => {
    renderRow();
    expect(screen.getByText('15%')).toBeInTheDocument();
  });

  it('renders a fixed discount with $ prefix', () => {
    renderRow({
      ...defaultProps,
      row: { ...baseRow, discount_type: 'BY_FIXED', discount_amount: 10 },
    });
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });

  it('renders from_date and to_date', () => {
    renderRow();
    expect(screen.getByText('2026-06-01')).toBeInTheDocument();
    expect(screen.getByText('2026-12-31')).toBeInTheDocument();
  });

  it('renders — when to_date is missing', () => {
    renderRow({ ...defaultProps, row: { ...baseRow, to_date: undefined } });
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders times_used count', () => {
    renderRow();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders the coupon code when present', () => {
    renderRow({
      ...defaultProps,
      row: { ...baseRow, coupon_code: 'SUMMER10' },
    });
    expect(screen.getByText('SUMMER10')).toBeInTheDocument();
  });

  it('renders the view icon button', () => {
    renderRow();
    expect(screen.getByTestId('icon-solar:eye-bold')).toBeInTheDocument();
  });

  it('renders the edit icon button', () => {
    renderRow();
    expect(screen.getByTestId('icon-solar:pen-bold')).toBeInTheDocument();
  });

  it('renders the delete icon button', () => {
    renderRow();
    expect(screen.getByTestId('icon-solar:trash-bin-trash-bold')).toBeInTheDocument();
  });

  it('renders the pause button for ACTIVE status', () => {
    renderRow();
    expect(screen.getByTestId('icon-solar:stop-circle-bold')).toBeInTheDocument();
  });

  it('does not render the pause button for non-ACTIVE status', () => {
    renderRow({ ...defaultProps, row: { ...baseRow, status: 'PAUSED' } });
    expect(screen.queryByTestId('icon-solar:stop-circle-bold')).not.toBeInTheDocument();
  });

  it('renders the activate button for PAUSED status', () => {
    renderRow({ ...defaultProps, row: { ...baseRow, status: 'PAUSED' } });
    expect(screen.getByTestId('icon-solar:play-circle-bold')).toBeInTheDocument();
  });

  it('renders the activate button for PENDING_APPROVAL status', () => {
    renderRow({ ...defaultProps, row: { ...baseRow, status: 'PENDING_APPROVAL' } });
    expect(screen.getByTestId('icon-solar:play-circle-bold')).toBeInTheDocument();
  });

  it('does not render the activate button for ACTIVE status', () => {
    renderRow();
    expect(screen.queryByTestId('icon-solar:play-circle-bold')).not.toBeInTheDocument();
  });

  it('calls onView with the entity_id when view button is clicked', () => {
    const onView = jest.fn();
    renderRow({ ...defaultProps, onView });
    fireEvent.click(screen.getByTestId('icon-solar:eye-bold').closest('button')!);
    expect(onView).toHaveBeenCalledWith(10);
  });

  it('calls onEdit with the entity_id when edit button is clicked', () => {
    const onEdit = jest.fn();
    renderRow({ ...defaultProps, onEdit });
    fireEvent.click(screen.getByTestId('icon-solar:pen-bold').closest('button')!);
    expect(onEdit).toHaveBeenCalledWith(10);
  });

  it('calls onPause with the entity_id when pause button is clicked', () => {
    const onPause = jest.fn();
    renderRow({ ...defaultProps, onPause });
    fireEvent.click(screen.getByTestId('icon-solar:stop-circle-bold').closest('button')!);
    expect(onPause).toHaveBeenCalledWith(10);
  });

  it('calls onActivate with the entity_id when activate button is clicked', () => {
    const onActivate = jest.fn();
    renderRow({ ...defaultProps, row: { ...baseRow, status: 'PAUSED' }, onActivate });
    fireEvent.click(screen.getByTestId('icon-solar:play-circle-bold').closest('button')!);
    expect(onActivate).toHaveBeenCalledWith(10);
  });

  it('calls onDelete with the entity_id when delete button is clicked', () => {
    const onDelete = jest.fn();
    renderRow({ ...defaultProps, onDelete });
    fireEvent.click(screen.getByTestId('icon-solar:trash-bin-trash-bold').closest('button')!);
    expect(onDelete).toHaveBeenCalledWith(10);
  });
});
