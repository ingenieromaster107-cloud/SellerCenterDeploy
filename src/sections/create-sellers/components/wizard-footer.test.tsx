import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { WizardFooter } from './wizard-footer';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/routes/paths', () => ({
  paths: { auth: { signIn: '/auth/sign-in' } },
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('WizardFooter', () => {
  it('renders default continue button', () => {
    renderWithTheme(<WizardFooter />);
    expect(screen.getByText('createSellers.common.continue')).toBeInTheDocument();
  });

  it('renders custom submit label key', () => {
    renderWithTheme(<WizardFooter submitLabelKey="createSellers.common.finish" />);
    expect(screen.getByText('createSellers.common.finish')).toBeInTheDocument();
  });

  it('renders already have account text', () => {
    renderWithTheme(<WizardFooter />);
    expect(screen.getByText('createSellers.common.alreadyHaveAccount')).toBeInTheDocument();
  });

  it('renders sign in link', () => {
    renderWithTheme(<WizardFooter />);
    const link = screen.getByText('createSellers.common.signIn');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/auth/sign-in');
  });

  it('renders submit button as submit type', () => {
    renderWithTheme(<WizardFooter />);
    const button = screen.getByRole('button', { name: 'createSellers.common.continue' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('disables button when disabled prop is true', () => {
    renderWithTheme(<WizardFooter disabled />);
    const button = screen.getByRole('button', { name: 'createSellers.common.continue' });
    expect(button).toBeDisabled();
  });
});
