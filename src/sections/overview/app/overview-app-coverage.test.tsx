import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import * as appViewIndex from './view';
import { AppWidget } from './app-widget';
import { AppWelcome } from './app-welcome';
import { AppKpiCard } from './view/app-kpi-card';
import { AppTopAuthors } from './app-top-authors';
import { AppTopRelated } from './app-top-related';
import { AppNewInvoices } from './app-new-invoices';
import { AppTopProducts } from './app-top-products';
import { AppTopCustomers } from './app-top-customers';
import { AppAreaInstalled } from './app-area-installed';
import { AppWidgetSummary } from './app-widget-summary';
import { OverviewAppView } from './view/overview-app-view';
import { AppCurrentDownload } from './app-current-download';
import { AppTopInstalledCountries } from './app-top-installed-countries';

const mockedUseTabs = jest.fn();
const mockedUsePopover = jest.fn();

jest.mock('minimal-shared/hooks', () => ({
  usePopover: () => mockedUsePopover(),
  useTabs: (...args: unknown[]) => mockedUseTabs(...args),
}));

jest.mock('minimal-shared/utils', () => ({
  varAlpha: (color: string, alpha: number | string) => `rgba(${color}/${alpha})`,
}));

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

jest.mock('src/utils/format-number', () => ({
  fCurrency: (value: number) => `$${value}`,
  fData: (value: number) => `${value}B`,
  fNumber: (value: number | string) => `N:${value}`,
  fPercent: (value: number) => `${value}%`,
  fShortenNumber: (value: number) => `S:${value}`,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/svg-color', () => ({
  SvgColor: ({ src }: { src: string }) => <span data-testid={`svg-${src}`} />,
}));

jest.mock('src/components/flag-icon', () => ({
  FlagIcon: ({ code }: { code: string }) => <span data-testid={`flag-${code}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children, color }: { children: React.ReactNode; color?: string }) => (
    <span data-color={color}>{children}</span>
  ),
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('src/components/table', () => ({
  TableHeadCustom: ({ headCells }: { headCells: Array<{ id: string; label?: string }> }) => (
    <thead>
      <tr>
        {headCells.map((headCell, index) => (
          <th key={`${headCell.id}-${index}`}>{headCell.label ?? headCell.id}</th>
        ))}
      </tr>
    </thead>
  ),
}));

jest.mock('src/components/custom-popover', () => ({
  CustomPopover: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <tr><td>{children}</td></tr> : null,
}));

jest.mock('src/components/chart', () => ({
  Chart: ({ type, series, options }: { type: string; series: unknown; options?: any }) => {
    options?.tooltip?.y?.formatter?.(123);
    options?.tooltip?.y?.title?.formatter?.('series');
    options?.plotOptions?.pie?.donut?.labels?.value?.formatter?.(321);
    options?.plotOptions?.pie?.donut?.labels?.total?.formatter?.({ globals: { seriesTotals: [1, 2, 3] } });
    return (
      <div data-testid={`chart-${type}`} data-options={JSON.stringify(options ?? {})}>
        {JSON.stringify(series)}
      </div>
    );
  },
  ChartLegends: ({ labels }: { labels?: string[] }) => (
    <div data-testid="chart-legends">{JSON.stringify(labels ?? [])}</div>
  ),
  ChartSelect: ({
    onChange,
    options,
    value,
  }: {
    value: string;
    options: string[];
    onChange: (newValue: string) => void;
  }) => (
    <select aria-label="chart-select" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ),
  useChart: (value: unknown) => value,
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: { children: React.ReactNode }) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (namespace: string, key?: string) => (key ? `${namespace}.${key}` : namespace),
  }),
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (namespace: string, key?: string) => (key ? `${namespace}.${key}` : namespace),
  }),
}));

jest.mock('src/_mock', () => ({
  _appCustomers: [{ id: 'c1', name: 'Mock Customer', email: 'customer@mail.com' }],
  _appInvoices: [
    {
      id: 'inv1',
      customer: 'Mock Customer',
      date: '2026-01-01',
      invoiceNumber: 'INV-001',
      price: 100,
      status: 'Entregado',
    },
  ],
  _appProducts: [{ id: 'p1', image: '/x.png', name: 'Mock Product', totalFavorites: 4 }],
}));

const theme = createTheme({ cssVariables: true } as any);
(theme as any).mixins = {
  ...(theme as any).mixins,
  bgGradient: ({ images }: { images: string[] }) => ({ backgroundImage: images.join(',') }),
};

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('overview app coverage', () => {
  beforeEach(() => {
    mockedUsePopover.mockReturnValue({
      anchorEl: null,
      onClose: jest.fn(),
      onOpen: jest.fn(),
      open: true,
    });
    mockedUseTabs.mockReturnValue({
      onChange: jest.fn(),
      value: '7days',
    });
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('covers app cards, tables, lists and charts', () => {
    renderWithTheme(
      <AppWidget
        icon="solar:users-group-rounded-bold"
        title="Users"
        total={1000}
        chart={{ series: 33 }}
      />
    );
    renderWithTheme(
      <AppWidget
        icon="solar:users-group-rounded-bold"
        title="Users"
        total={1000}
        chart={{ colors: ['#111', '#222'], options: { custom: true }, series: 33 }}
      />
    );
    renderWithTheme(
      <AppWelcome
        action={<button type="button">Go</button>}
        description="Welcome"
        img={<div>img</div>}
        title={'Hello\nteam'}
      />
    );
    renderWithTheme(<AppWelcome />);
    renderWithTheme(<AppWelcome sx={[{ borderWidth: 1 }]} title="With sx array" />);

    renderWithTheme(
      <AppWidgetSummary
        chart={{ categories: ['A'], series: [1] }}
        percent={3.3}
        title="Revenue"
        total={99}
      />
    );
    renderWithTheme(
      <AppWidgetSummary
        chart={{ categories: ['A'], series: [1] }}
        percent={0}
        sx={[{ borderWidth: 1 }]}
        title="Revenue"
        total={99}
      />
    );
    renderWithTheme(
      <AppWidgetSummary
        chart={{ categories: ['A'], series: [1] }}
        percent={-3.3}
        title="Revenue"
        total={99}
      />
    );

    renderWithTheme(
      <AppTopCustomers
        list={[
          { email: 'b@mail.com', id: '2', name: 'B' },
          { email: 'a@mail.com', id: '1', name: 'A' },
        ]}
      />
    );

    renderWithTheme(
      <AppTopProducts
        list={[
          { id: '1', image: '/1.png', name: 'Product 1', totalFavorites: 1 },
          { id: '2', image: '/2.png', name: 'Product 2', totalFavorites: 2 },
        ]}
      />
    );
    renderWithTheme(
      <AppTopProducts
        list={[{ id: '3', image: '/3.png', name: 'Product 3', totalFavorites: 3 }]}
        sx={[{ borderWidth: 1 }]}
      />
    );

    renderWithTheme(
      <AppCurrentDownload
        chart={{
          series: [
            { label: 'A', value: 5 },
            { label: 'B', value: 7 },
          ],
        }}
      />
    );
    renderWithTheme(
      <AppCurrentDownload
        chart={{
          colors: ['#111', '#222', '#333', '#444'],
          series: [{ label: 'C', value: 9 }],
        }}
      />
    );

    renderWithTheme(
      <AppAreaInstalled
        chart={{
          categories: ['Jan'],
          series: [
            { data: [{ data: [1], name: 'Asia' }], name: '2023' },
            { data: [{ data: [2], name: 'Europe' }], name: '2024' },
          ],
        }}
      />
    );
    fireEvent.change(screen.getByLabelText('chart-select'), { target: { value: '2024' } });
    renderWithTheme(
      <AppAreaInstalled
        chart={{
          categories: ['Jan'],
          series: [{ data: [{ data: [1], name: 'Asia' }], name: 'unknown' }],
        }}
        sx={[{ borderWidth: 1 }]}
      />
    );

    renderWithTheme(
      <AppNewInvoices
        headCells={[
          { id: 'id', label: 'ID' },
          { id: 'status', label: 'Status' },
        ]}
        tableData={[
          { customer: 'A', date: '2026-01-01', id: '1', invoiceNumber: 'INV-1', price: 1, status: 'Cancelado' },
          { customer: 'B', date: '2026-01-01', id: '2', invoiceNumber: 'INV-2', price: 2, status: 'Entregado' },
          {
            customer: 'C',
            date: '2026-01-01',
            id: '3',
            invoiceNumber: 'INV-3',
            price: 3,
            status: 'Orden Confirmada',
          },
          {
            customer: 'D',
            date: '2026-01-01',
            id: '4',
            invoiceNumber: 'INV-4',
            price: 4,
            status: 'Orden en Proceso',
          },
          {
            customer: 'E',
            date: '2026-01-01',
            id: '5',
            invoiceNumber: 'INV-5',
            price: 5,
            status: 'Pago por confirmar',
          },
          { customer: 'F', date: '2026-01-01', id: '6', invoiceNumber: 'INV-6', price: 6, status: 'Other' },
        ]}
      />
    );
    fireEvent.click(screen.getAllByText('Download')[0]);
    fireEvent.click(screen.getAllByText('Print')[0]);
    fireEvent.click(screen.getAllByText('Share')[0]);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    mockedUsePopover.mockReturnValueOnce({
      anchorEl: null,
      onClose: jest.fn(),
      onOpen: jest.fn(),
      open: false,
    });
    renderWithTheme(
      <AppNewInvoices
        headCells={[{ id: 'id', label: 'ID' }]}
        tableData={[{ customer: 'A', date: '2026-01-01', id: '1', invoiceNumber: 'INV-1', price: 1, status: 'Other' }]}
      />
    );

    renderWithTheme(
      <AppTopRelated
        list={[
          {
            downloaded: 1200,
            id: '1',
            name: 'Free App',
            price: 0,
            ratingNumber: 1,
            shortcut: '/x.png',
            size: 500,
            totalReviews: 2,
          },
          {
            downloaded: 500,
            id: '2',
            name: 'Paid App',
            price: 30,
            ratingNumber: 1,
            shortcut: '/y.png',
            size: 300,
            totalReviews: 4,
          },
        ]}
      />
    );
    renderWithTheme(
      <AppTopRelated
        list={[
          {
            downloaded: 1,
            id: '3',
            name: 'With sx',
            price: 1,
            ratingNumber: 1,
            shortcut: '/z.png',
            size: 1,
            totalReviews: 1,
          },
        ]}
        sx={[{ borderWidth: 1 }]}
      />
    );

    renderWithTheme(
      <AppTopInstalledCountries
        list={[{ android: 1000, apple: 3000, countryCode: 'co', countryName: 'Colombia', id: '1', windows: 2000 }]}
      />
    );
    renderWithTheme(
      <AppTopInstalledCountries
        list={[{ android: 1, apple: 1, countryCode: 'us', countryName: 'USA', id: '2', windows: 1 }]}
        sx={[{ borderWidth: 1 }]}
      />
    );

    renderWithTheme(
      <AppTopAuthors
        list={[
          { avatarUrl: '/1.png', id: '1', name: 'One', totalFavorites: 30 },
          { avatarUrl: '/2.png', id: '2', name: 'Two', totalFavorites: 20 },
          { avatarUrl: '/3.png', id: '3', name: 'Three', totalFavorites: 10 },
        ]}
      />
    );
    renderWithTheme(
      <AppTopAuthors
        list={[{ avatarUrl: '/4.png', id: '4', name: 'Four', totalFavorites: 1 }]}
        sx={[{ borderWidth: 1 }]}
      />
    );

    renderWithTheme(
      <AppKpiCard
        percent={5}
        series={[1, 2, 3]}
        showPeriod
        title="KPI"
        total={100}
        transparentCard
      />
    );
    renderWithTheme(<AppKpiCard percent={-5} series={[1, 2, 3]} title="KPI2" total={100} />);

    renderWithTheme(<OverviewAppView />);

    expect(screen.getByTestId('home-content')).toBeInTheDocument();
    expect(appViewIndex).toBeDefined();
    expect(screen.getAllByTestId('chart-bar').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('chart-donut').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('chart-radialBar').length).toBeGreaterThan(0);
    expect(screen.getByText('tableLatestOrders.title')).toBeInTheDocument();
  });
});
