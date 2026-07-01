import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useNavData } from './nav-config-home';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/home' },
    dashboard: { root: '/dashboard' },
    product: { root: '/products', load: '/products/load', create: '/products/create' },
    order: { root: '/orders' },
    return: { root: '/returns' },
    feedback: { root: '/feedback' },
    academy: { root: '/academy' },
    chat: { root: '/chat' },
    movements: { root: '/movements' },
    promotions: { root: '/promotions', list: '/promotions/list', create: '/promotions/create' },
    clients: { root: '/clients' },
    account: { root: '/account', subaccount: { root: '/account/subaccounts' } },
  },
}));

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/svg-color', () => ({
  SvgColor: ({ src }: any) => <img src={src} alt="icon" />,
}));

const theme = createTheme({ cssVariables: true } as any);

function TestNavData() {
  const navData = useNavData();
  return (
    <div data-testid="nav-sections" data-count={navData.length}>
      {navData.map((section: any, i: number) => (
        <div key={i} data-testid={`section-${i}`}>
          {section.items?.map((item: any, j: number) => (
            <span key={j} data-testid={`item-${i}-${j}`}>
              {item.title}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

describe('useNavData', () => {
  it('returns nav data with multiple sections', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <TestNavData />
      </ThemeProvider>
    );
    const container = getByTestId('nav-sections');
    expect(Number(container.dataset.count)).toBeGreaterThan(0);
  });

  it('includes home item', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <TestNavData />
      </ThemeProvider>
    );
    expect(getByText('sidebarMenu.home.title')).toBeInTheDocument();
  });

  it('includes dashboard item', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <TestNavData />
      </ThemeProvider>
    );
    expect(getByText('sidebarMenu.dashboard.title')).toBeInTheDocument();
  });

  it('includes products item', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <TestNavData />
      </ThemeProvider>
    );
    expect(getByText('sidebarMenu.myProducts.title')).toBeInTheDocument();
  });

  it('includes orders item', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <TestNavData />
      </ThemeProvider>
    );
    expect(getByText('ordersModule.title')).toBeInTheDocument();
  });
});
