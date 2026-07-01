import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CreateSellersView } from './create-sellers-view';

jest.mock('src/routes/paths', () => ({
  paths: { auth: { signIn: '/sign-in' } },
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/actions/seller/use-create-seller', () => ({
  useCreateSeller: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('src/components/snackbar', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockOnNext1 = jest.fn();
jest.mock('../components/create-sellers-step-1', () => ({
  CreateSellersStep1: ({ onNext }: any) => (
    <div data-testid="step-1">
      <button onClick={() => onNext({ country: 'US', personType: 'natural_person', mainCategory: '1', mainCategoryName: 'Electronics' })}>
        next-step1
      </button>
    </div>
  ),
}));

const mockOnNext2 = jest.fn();
jest.mock('../components/create-sellers-step-2', () => ({
  CreateSellersStep2: ({ onNext, onBack }: any) => (
    <div data-testid="step-2">
      <button onClick={onBack}>back-step2</button>
      <button onClick={() => onNext({
        firstName: 'John', lastName: 'Doe', email: 'j@test.com',
        password: '123456', confirmPassword: '123456',
        documentType: 'cc', documentNumber: '123', documentTypeLabel: 'CC',
        phone: '3001234567', region: 'r1', regionName: 'Region', city: 'c1',
        cityName: 'City', postcode: '110', addressShop: 'Calle 1', shopUrl: 'store',
        phoneE164: '+573001234567',
      })}>next-step2</button>
    </div>
  ),
}));

jest.mock('../components/create-sellers-step-3', () => ({
  CreateSellersStep3: ({ onBack }: any) => (
    <div data-testid="step-3">
      <button onClick={onBack}>back-step3</button>
    </div>
  ),
  STEP3_DEFAULT_FORM: {},
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('CreateSellersView', () => {
  it('renders step 1 initially', () => {
    renderWithTheme(<CreateSellersView />);
    expect(screen.getByTestId('step-1')).toBeInTheDocument();
  });

  it('advances to step 2 after step 1 next', () => {
    renderWithTheme(<CreateSellersView />);
    fireEvent.click(screen.getByText('next-step1'));
    expect(screen.getByTestId('step-2')).toBeInTheDocument();
  });

  it('goes back to step 1 from step 2', () => {
    renderWithTheme(<CreateSellersView />);
    fireEvent.click(screen.getByText('next-step1'));
    fireEvent.click(screen.getByText('back-step2'));
    expect(screen.getByTestId('step-1')).toBeInTheDocument();
  });

  it('advances to step 3 after step 2 next', () => {
    renderWithTheme(<CreateSellersView />);
    fireEvent.click(screen.getByText('next-step1'));
    fireEvent.click(screen.getByText('next-step2'));
    expect(screen.getByTestId('step-3')).toBeInTheDocument();
  });

  it('goes back to step 2 from step 3', () => {
    renderWithTheme(<CreateSellersView />);
    fireEvent.click(screen.getByText('next-step1'));
    fireEvent.click(screen.getByText('next-step2'));
    fireEvent.click(screen.getByText('back-step3'));
    expect(screen.getByTestId('step-2')).toBeInTheDocument();
  });
});
