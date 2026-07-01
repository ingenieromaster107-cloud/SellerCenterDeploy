import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CreateSellersStep1 } from './create-sellers-step-1';

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async () => ({ values: {}, errors: {} }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/actions/category/use-categories', () => ({
  useCategories: () => ({
    categoryTree: [{ id: 1, name: 'Electronics' }],
    categoriesLoading: false,
  }),
}));

jest.mock('src/components/flag-icon', () => ({
  FlagIcon: ({ code }: any) => <span data-testid={`flag-${code}`} />,
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  Field: {
    Select: ({ name, label, children }: any) => (
      <div data-testid={`field-select-${name}`}>
        <label>{label}</label>
        <div>{children}</div>
      </div>
    ),
  },
}));

jest.mock('./styles', () => ({ darkFieldSx: {} }));
jest.mock('./wizard-shell', () => ({
  WizardShell: ({ children }: any) => <div data-testid="wizard-shell">{children}</div>,
}));
jest.mock('./wizard-footer', () => ({
  WizardFooter: () => <button type="submit" data-testid="wizard-footer">Next</button>,
}));
jest.mock('./step-indicator', () => ({
  StepIndicator: ({ current, total }: any) => (
    <div data-testid="step-indicator">{`${current}/${total}`}</div>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const defaultProps = {
  defaultValues: { country: '', personType: '', mainCategory: '' },
  step: 1,
  total: 3,
  onNext: jest.fn(),
};

describe('CreateSellersStep1', () => {
  it('renders wizard shell', () => {
    renderWithTheme(<CreateSellersStep1 {...defaultProps} />);
    expect(screen.getByTestId('wizard-shell')).toBeInTheDocument();
  });

  it('renders step indicator with correct numbers', () => {
    renderWithTheme(<CreateSellersStep1 {...defaultProps} />);
    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('renders country select field', () => {
    renderWithTheme(<CreateSellersStep1 {...defaultProps} />);
    expect(screen.getByTestId('field-select-country')).toBeInTheDocument();
  });

  it('renders personType select field', () => {
    renderWithTheme(<CreateSellersStep1 {...defaultProps} />);
    expect(screen.getByTestId('field-select-personType')).toBeInTheDocument();
  });

  it('renders mainCategory select field', () => {
    renderWithTheme(<CreateSellersStep1 {...defaultProps} />);
    expect(screen.getByTestId('field-select-mainCategory')).toBeInTheDocument();
  });

  it('renders footer with next button', () => {
    renderWithTheme(<CreateSellersStep1 {...defaultProps} />);
    expect(screen.getByTestId('wizard-footer')).toBeInTheDocument();
  });
});
