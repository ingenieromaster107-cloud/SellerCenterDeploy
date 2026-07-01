import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { UserPasswordSchema, ProfileChangePassword, updateUserPasswordSchema } from './profile-change-password';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/snackbar', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children, onSubmit }: any) => <form onSubmit={onSubmit}>{children}</form>,
  Field: {
    Text: ({ name, label, type }: any) => (
      <input
        name={name}
        aria-label={label}
        type={type ?? 'text'}
        data-testid={`field-${name}`}
      />
    ),
  },
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProfileChangePassword', () => {
  it('renders old password field', () => {
    renderWithTheme(<ProfileChangePassword />);
    expect(screen.getByTestId('field-oldPassword')).toBeInTheDocument();
  });

  it('renders new password field', () => {
    renderWithTheme(<ProfileChangePassword />);
    expect(screen.getByTestId('field-newPassword')).toBeInTheDocument();
  });

  it('renders confirm new password field', () => {
    renderWithTheme(<ProfileChangePassword />);
    expect(screen.getByTestId('field-confirmNewPassword')).toBeInTheDocument();
  });

  it('renders save button', () => {
    renderWithTheme(<ProfileChangePassword />);
    expect(screen.getByRole('button', { name: 'formPlaceholder.btnSave' })).toBeInTheDocument();
  });

  it('accepts className prop', () => {
    const { container } = renderWithTheme(<ProfileChangePassword className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

describe('UserPasswordSchema', () => {
  const t = (key: string) => key;

  it('rejects when oldPassword is empty', async () => {
    const schema = UserPasswordSchema(t);
    const result = await schema.safeParseAsync({
      oldPassword: '',
      newPassword: 'newPass123',
      confirmNewPassword: 'newPass123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when newPassword equals oldPassword', async () => {
    const schema = UserPasswordSchema(t);
    const result = await schema.safeParseAsync({
      oldPassword: 'samePass',
      newPassword: 'samePass',
      confirmNewPassword: 'samePass',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when passwords do not match', async () => {
    const schema = UserPasswordSchema(t);
    const result = await schema.safeParseAsync({
      oldPassword: 'oldPass123',
      newPassword: 'newPass123',
      confirmNewPassword: 'differentPass',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid password data', async () => {
    const schema = UserPasswordSchema(t);
    const result = await schema.safeParseAsync({
      oldPassword: 'oldPass123',
      newPassword: 'newPass456',
      confirmNewPassword: 'newPass456',
    });
    expect(result.success).toBe(true);
  });
});

describe('updateUserPasswordSchema', () => {
  it('is exported and defined', () => {
    expect(updateUserPasswordSchema).toBeDefined();
  });
});
