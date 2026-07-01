import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useGetCustomer as useGetCustomerHook } from 'src/actions/customer/use-get-customer';

import { UserProfileView } from './user-profile-view';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/home' },
    account: { root: '/account' },
  },
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

const mockGetSearchParam = jest.fn((_key: string): string | null => null);

jest.mock('src/routes/hooks', () => ({
  usePathname: () => '/account',
  useSearchParams: () => ({ get: mockGetSearchParam }),
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/custom-breadcrumbs/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/components/loading-screen/loading-screen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

jest.mock('src/components/error-content', () => ({
  ErrorContent: ({ title }: any) => <div data-testid="error-content">{title}</div>,
}));

jest.mock('src/actions/customer/use-get-customer', () => ({
  useGetCustomer: jest.fn(),
}));

jest.mock('../components/profile-cover', () => ({
  ProfileCover: ({ name }: any) => <div data-testid="profile-cover">{name}</div>,
}));

jest.mock('../components', () => ({
  ProfileHome: () => <div data-testid="profile-home" />,
  ProfileDocuments: () => <div data-testid="profile-documents" />,
  ProfileTemplates: () => <div data-testid="profile-templates" />,
  ProfileConfiguration: () => <div data-testid="profile-configuration" />,
  ProfileChangePassword: () => <div data-testid="profile-change-password" />,
}));

const useGetCustomer = useGetCustomerHook as unknown as jest.Mock;

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockCustomer = {
  firstname: 'Juan',
  lastname: 'Pérez',
  email: 'juan@example.com',
};

describe('UserProfileView', () => {
  beforeEach(() => {
    useGetCustomer.mockReturnValue({
      customer: mockCustomer,
      isLoading: false,
      isError: false,
    });
  });

  it('renders home content wrapper', () => {
    renderWithTheme(<UserProfileView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithTheme(<UserProfileView />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders profile cover with display name', () => {
    renderWithTheme(<UserProfileView />);
    expect(screen.getByTestId('profile-cover')).toHaveTextContent('Juan Pérez');
  });

  it('renders ProfileHome tab by default (no tab param)', () => {
    renderWithTheme(<UserProfileView />);
    expect(screen.getByTestId('profile-home')).toBeInTheDocument();
  });

  it('renders loading screen when isLoading', () => {
    useGetCustomer.mockReturnValue({ customer: null, isLoading: true, isError: false });
    renderWithTheme(<UserProfileView />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('renders error content when isError', () => {
    useGetCustomer.mockReturnValue({ customer: null, isLoading: false, isError: true });
    renderWithTheme(<UserProfileView />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('renders error content when customer is null', () => {
    useGetCustomer.mockReturnValue({ customer: null, isLoading: false, isError: false });
    renderWithTheme(<UserProfileView />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('renders tabs navigation', () => {
    renderWithTheme(<UserProfileView />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('uses email as display name when no firstname/lastname', () => {
    useGetCustomer.mockReturnValue({
      customer: { ...mockCustomer, firstname: '', lastname: '' },
      isLoading: false,
      isError: false,
    });
    renderWithTheme(<UserProfileView />);
    expect(screen.getByTestId('profile-cover')).toHaveTextContent('juan@example.com');
  });
});

describe('UserProfileView with tab param', () => {
  beforeEach(() => {
    useGetCustomer.mockReturnValue({
      customer: mockCustomer,
      isLoading: false,
      isError: false,
    });
  });

  it('renders ProfileConfiguration when tab=configuration', () => {
    mockGetSearchParam.mockImplementation((k: string) => k === 'tab' ? 'configuration' : null);
    renderWithTheme(<UserProfileView />);
    expect(screen.getByTestId('profile-configuration')).toBeInTheDocument();
    mockGetSearchParam.mockImplementation((_k: string) => null);
  });

  it('renders ProfileChangePassword when tab=security', () => {
    mockGetSearchParam.mockImplementation((k: string) => k === 'tab' ? 'security' : null);
    renderWithTheme(<UserProfileView />);
    expect(screen.getByTestId('profile-change-password')).toBeInTheDocument();
    mockGetSearchParam.mockImplementation((_k: string) => null);
  });
});
