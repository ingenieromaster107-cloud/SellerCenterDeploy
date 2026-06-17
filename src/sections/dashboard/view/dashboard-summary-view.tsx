'use client';

import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useSellerKpiMetrics } from 'src/hooks/dashboard/use-seller-kpi-metrics';
import { useSellerSummaryDashboard } from 'src/hooks/dashboard/use-seller-summary-dashboard';

import { fNumber, fCurrency } from 'src/utils/format-number';
import { fDate, FORMAT_PATTERNS } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { KPI_METRICS } from '../constants';
import { KpiMetricCard } from './kpi-metric-card';

// ----------------------------------------------------------------------

export function DashboardSummaryView() {
  const { translate } = useTranslate();

  const today = dayjs();
  const defaultFrom = today.subtract(1, 'month');

  const [dateFilters, setDateFilters] = useState<{ fromDate: Dayjs | null; toDate: Dayjs | null }>({
    fromDate: defaultFrom,
    toDate: today,
  });

  const [dateError, setDateError] = useState(false);
  const [appliedDateRange, setAppliedDateRange] = useState({
    fromDate: defaultFrom.format(FORMAT_PATTERNS.iso.date),
    toDate: today.format(FORMAT_PATTERNS.iso.date),
  });

  const { summary, hasLiveData, isLoading } = useSellerSummaryDashboard(appliedDateRange);

  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareFilters, setCompareFilters] = useState<{ fromDate: Dayjs | null; toDate: Dayjs | null }>({
    fromDate: defaultFrom.subtract(1, 'month'),
    toDate: defaultFrom.subtract(1, 'day'),
  });

  const compareRange =
    compareEnabled && compareFilters.fromDate && compareFilters.toDate
      ? {
          compareFromDate: compareFilters.fromDate.format(FORMAT_PATTERNS.iso.date),
          compareToDate: compareFilters.toDate.format(FORMAT_PATTERNS.iso.date),
        }
      : { compareFromDate: null, compareToDate: null };

  const { data: kpiData, hasComparison, isLoading: isKpiLoading } = useSellerKpiMetrics({
    ...appliedDateRange,
    ...compareRange,
  });

  const kpiPeriodLabel = kpiData
    ? `${fDate(kpiData.period_from, FORMAT_PATTERNS.split.date)} – ${fDate(kpiData.period_to, FORMAT_PATTERNS.split.date)}`
    : '';

  const kpiCompareLabel =
    hasComparison && kpiData?.compare_from && kpiData?.compare_to
      ? `${fDate(kpiData.compare_from, FORMAT_PATTERNS.split.date)} – ${fDate(kpiData.compare_to, FORMAT_PATTERNS.split.date)}`
      : '';

  const kpiPeriodDays = kpiData
    ? dayjs(kpiData.period_to).diff(dayjs(kpiData.period_from), 'day') + 1
    : 0;

  const kpiCompareDays =
    hasComparison && kpiData?.compare_from && kpiData?.compare_to
      ? dayjs(kpiData.compare_to).diff(dayjs(kpiData.compare_from), 'day') + 1
      : 0;

  const periodALabel = `${fDate(appliedDateRange.fromDate, FORMAT_PATTERNS.split.date)} – ${fDate(appliedDateRange.toDate, FORMAT_PATTERNS.split.date)}`;

  const handleStartDate = useCallback((newValue: Dayjs | null) => {
    if (!newValue) return;

    setDateFilters((prev) => {
      const next = { ...prev, fromDate: newValue };
      const hasInvalidRange = Boolean(next.toDate?.isBefore(next.fromDate, 'day'));
      setDateError(hasInvalidRange);

      if (!hasInvalidRange && next.toDate) {
        setAppliedDateRange({
          fromDate: next.fromDate.format(FORMAT_PATTERNS.iso.date),
          toDate: next.toDate.format(FORMAT_PATTERNS.iso.date),
        });
      }

      return next;
    });
  }, []);

  const handleEndDate = useCallback((newValue: Dayjs | null) => {
    if (!newValue) return;

    setDateFilters((prev) => {
      const next = { ...prev, toDate: newValue };
      const hasInvalidRange = Boolean(next.toDate?.isBefore(next.fromDate, 'day'));
      setDateError(hasInvalidRange);

      if (!hasInvalidRange && next.fromDate) {
        setAppliedDateRange({
          fromDate: next.fromDate.format(FORMAT_PATTERNS.iso.date),
          toDate: next.toDate.format(FORMAT_PATTERNS.iso.date),
        });
      }

      return next;
    });
  }, []);

  const fallbackSummaryData = {
    sales_account: { total_sales: 0, total_returns: 0 },
    orders_account: {
      created_orders: 0,
      pending_payment_orders: 0,
      pending_return_orders: 0,
      canceled_orders: 0,
      returned_orders: 0,
    },
    products_account: {
      created_products: 0,
      active_products: 0,
      inactive_products: 0,
      pending_approval_products: 0,
      out_of_stock_products: 0,
    },
    logistics_account: {
      pending_shipment_orders: 0,
      shipped_orders: 0,
      delivered_orders: 0,
    },
    reputation_account: {
      reviews_count: 0,
      stars_count: 0,
    },
  };

  const showPlaceholder = isLoading || !hasLiveData;
  const summaryData = summary.data ?? fallbackSummaryData;

  const summaryCards = [
    {
      title: translate('dashboardModule.summary.cards.sales'),
      path: paths.order.root,
      icon: 'solar:tag-horizontal-bold-duotone',
      value: showPlaceholder ? '0' : fCurrency(summaryData.sales_account.total_sales),
    },
    {
      title: translate('dashboardModule.summary.cards.orders'),
      path: paths.order.root,
      icon: 'solar:cart-3-bold',
      value: showPlaceholder ? '0' : fNumber(summaryData.orders_account.created_orders),
    },
    {
      title: translate('dashboardModule.summary.cards.products'),
      path: paths.product.root,
      icon: 'solar:list-bold',
      value: showPlaceholder ? '0' : fNumber(summaryData.products_account.created_products),
    },
    {
      title: translate('dashboardModule.summary.cards.logistics'),
      path: paths.return.root,
      icon: 'solar:ssd-round-bold',
      value: showPlaceholder ? '0' : fNumber(summaryData.logistics_account.pending_shipment_orders),
    },
    {
      title: translate('dashboardModule.summary.cards.reputation'),
      path: paths.feedback.root,
      icon: 'solar:cup-star-bold',
      value: showPlaceholder ? '0' : `${fNumber(summaryData.reputation_account.stars_count)}%`,
    },
  ] as const;

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate('sidebarMenu.dashboard.title')}
        links={[
          { name: translate('breadcrumbs.home'), href: paths.home.root },
          { name: translate('sidebarMenu.dashboard.title') },
        ]}
        sx={{ mb: { xs: 2, md: 3 } }}
      />

      <Card variant="outlined" sx={{ p: { xs: 2, md: 2.25 }, mb: 2.5 }} className="dashboard-summary-card">
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={compareEnabled}
                onChange={(event) => setCompareEnabled(event.target.checked)}
              />
            }
            label={translate('dashboardModule.kpiMetrics.compare')}
          />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, md: 3 }}
            divider={
              compareEnabled ? (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: 'none', md: 'block' } }}
                />
              ) : undefined
            }
          >
            <Stack spacing={1}>
              {compareEnabled && (
                <Typography variant="subtitle2">
                  {translate('dashboardModule.kpiMetrics.periodA')}
                </Typography>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <DatePicker
                  label={translate('dashboardModule.summary.filters.initialDate')}
                  value={dateFilters.fromDate}
                  onChange={handleStartDate}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: 'small',
                    },
                  }}
                  sx={{ width: { xs: 1, sm: 240 } }}
                />

                <DatePicker
                  label={translate('dashboardModule.summary.filters.finalDate')}
                  value={dateFilters.toDate}
                  onChange={handleEndDate}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: 'small',
                      error: dateError,
                      helperText: dateError ? translate('dashboardModule.summary.filters.invalidRange') : null,
                    },
                  }}
                  sx={{ width: { xs: 1, sm: 240 } }}
                />
              </Stack>
            </Stack>

            {compareEnabled && (
              <Stack spacing={1}>
                <Typography variant="subtitle2">
                  {translate('dashboardModule.kpiMetrics.periodB')}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <DatePicker
                    label={translate('dashboardModule.summary.filters.initialDate')}
                    value={compareFilters.fromDate}
                    onChange={(newValue) =>
                      setCompareFilters((prev) => ({ ...prev, fromDate: newValue }))
                    }
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: 'small' } }}
                    sx={{ width: { xs: 1, sm: 240 } }}
                  />

                  <DatePicker
                    label={translate('dashboardModule.summary.filters.finalDate')}
                    value={compareFilters.toDate}
                    onChange={(newValue) =>
                      setCompareFilters((prev) => ({ ...prev, toDate: newValue }))
                    }
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: 'small' } }}
                    sx={{ width: { xs: 1, sm: 240 } }}
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Card>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">{translate('dashboardModule.kpiMetrics.title')}</Typography>

        {kpiData && (
          <Typography variant="caption" color="text.secondary">
            {kpiCompareLabel
              ? `${translate('dashboardModule.kpiMetrics.periodA')}: ${kpiPeriodLabel} · ${translate('dashboardModule.kpiMetrics.periodB')}: ${kpiCompareLabel}`
              : `${translate('dashboardModule.kpiMetrics.period')}: ${kpiPeriodLabel}`}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          mb: 2.5,
          display: 'grid',
          gap: { xs: 2, md: 2.5 },
          gridTemplateColumns: {
            xs: 'repeat(1, minmax(0, 1fr))',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {KPI_METRICS.map((metric) => (
          <KpiMetricCard
            key={metric.key}
            title={translate(metric.titleKey)}
            metric={kpiData?.[metric.key]}
            format={metric.format}
            additive={metric.additive}
            hasComparison={hasComparison}
            isLoading={isKpiLoading}
            periodLabel={kpiPeriodLabel}
            periodDays={kpiPeriodDays}
            compareDays={kpiCompareDays}
          />
        ))}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">{translate('dashboardModule.summary.title')}</Typography>
        <Typography variant="caption" color="text.secondary">
          {`${translate('dashboardModule.kpiMetrics.periodA')}: ${periodALabel}`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 2.5 },
          gridTemplateColumns: {
            xs: 'repeat(1, minmax(0, 1fr))',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {summaryCards.map((card) => (
          <Card
            key={card.title}
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              borderColor: 'divider',
              background: 'background.paper',
              transition: (theme) =>
                theme.transitions.create(['transform', 'box-shadow', 'border-color'], {
                  duration: theme.transitions.duration.shorter,
                }),
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.shadows[6],
                borderColor: 'primary.main',
              },
            }}
          >
              <CardActionArea
                component={RouterLink}
                to={card.path}
                sx={{
                  px: { xs: 2.25, md: 2.5 },
                  py: { xs: 2, md: 2.25 },
                  minHeight: { xs: 156, md: 172 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
                aria-label={card.title}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 30,
                        height: 30,
                        color: 'primary.main',
                        bgcolor: 'primary.lighter',
                      }}
                    >
                      <Iconify icon={card.icon} width={16} />
                    </Avatar>

                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {card.title}
                    </Typography>
                  </Stack>

                  {showPlaceholder && (
                    <Typography variant="subtitle2" color="text.secondary">
                      {translate('dashboardModule.summary.upcoming')}
                    </Typography>
                  )}
                </Stack>

                <Stack spacing={0.75}>
                  <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    {card.value}
                  </Typography>

                  {showPlaceholder && (
                    <Chip
                      size="small"
                      color="default"
                      label={translate('dashboardModule.summary.upcoming')}
                      sx={{ width: 'fit-content', borderRadius: 1.5 }}
                    />
                  )}
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'primary.main' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {translate('dashboardModule.summary.detail')}
                  </Typography>
                  <Iconify icon="eva:arrow-ios-forward-fill" width={14} />
                </Stack>
              </CardActionArea>
          </Card>
        ))}
      </Box>
    </HomeContent>
  );
}
