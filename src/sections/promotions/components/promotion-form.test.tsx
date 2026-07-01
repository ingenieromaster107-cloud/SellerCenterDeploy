import { render, screen } from '@testing-library/react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async () => ({ values: {}, errors: {} }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/utils/format-time', () => ({
  FORMAT_PATTERNS: { iso: { date: 'YYYY-MM-DD' } },
}));

jest.mock('@mui/lab/LoadingButton', () => ({
  __esModule: true,
  default: ({ children, loading, ...props }: any) => (
    <button type="submit" disabled={loading} {...props}>
      {loading ? 'Saving...' : children}
    </button>
  ),
}));

import { PromotionForm } from './promotion-form';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </LocalizationProvider>
  );

describe('PromotionForm', () => {
  it('renders the basic info section', () => {
    renderWithTheme(
      <PromotionForm onSubmit={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByText('promotionsModule.form.sections.basic')).toBeInTheDocument();
  });

  it('renders the discount section', () => {
    renderWithTheme(
      <PromotionForm onSubmit={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByText('promotionsModule.form.sections.discount')).toBeInTheDocument();
  });

  it('renders the scope section', () => {
    renderWithTheme(
      <PromotionForm onSubmit={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByText('promotionsModule.form.sections.scope')).toBeInTheDocument();
  });

  it('renders name field', () => {
    renderWithTheme(
      <PromotionForm onSubmit={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByLabelText('promotionsModule.form.fields.name')).toBeInTheDocument();
  });

  it('renders cancel and save buttons', () => {
    renderWithTheme(
      <PromotionForm onSubmit={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByText('promotionsModule.form.actions.cancel')).toBeInTheDocument();
    expect(screen.getByText('promotionsModule.form.actions.save')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = jest.fn();
    renderWithTheme(
      <PromotionForm onSubmit={jest.fn()} onCancel={onCancel} />
    );
    screen.getByText('promotionsModule.form.actions.cancel').click();
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows loading state on save button', () => {
    renderWithTheme(
      <PromotionForm onSubmit={jest.fn()} onCancel={jest.fn()} isLoading />
    );
    const saveBtn = screen.getByRole('button', { name: /Saving/ });
    expect(saveBtn).toBeDisabled();
  });

  it('renders from_date and to_date pickers', () => {
    renderWithTheme(
      <PromotionForm onSubmit={jest.fn()} onCancel={jest.fn()} />
    );
    const fromFields = screen.getAllByLabelText('promotionsModule.form.fields.fromDate');
    expect(fromFields.length).toBeGreaterThan(0);
    const toFields = screen.getAllByLabelText('promotionsModule.form.fields.toDate');
    expect(toFields.length).toBeGreaterThan(0);
  });

  it('pre-populates name field when editing', () => {
    const initialValues: any = {
      name: 'Summer Sale',
      discount_type: 'BY_PERCENT',
      apply_type: 'AUTOMATIC',
      applies_to_all_products: true,
      from_date: '2026-07-01',
    };
    renderWithTheme(
      <PromotionForm
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        mode="edit"
        initialValues={initialValues}
      />
    );
    const nameInput = screen.getByLabelText('promotionsModule.form.fields.name') as HTMLInputElement;
    expect(nameInput.value).toBe('Summer Sale');
  });
});
