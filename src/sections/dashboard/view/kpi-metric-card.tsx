import type { KpiMetricFormat } from 'src/sections/dashboard/constants';
import type { SellerKpiMetric } from 'src/interfaces/dashboard/seller-kpi-metrics';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { fNumber, fPercent, fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  metric?: SellerKpiMetric;
  format: KpiMetricFormat;
  additive: boolean;
  hasComparison: boolean;
  isLoading: boolean;
  periodLabel?: string;
  periodDays?: number;
  compareDays?: number;
};

function formatValue(value: number, format: KpiMetricFormat): string {
  if (format === 'currency') return fCurrency(value);
  if (format === 'percent') return fPercent(value);
  return fNumber(value);
}

export function KpiMetricCard({
  title,
  metric,
  format,
  additive,
  hasComparison,
  isLoading,
  periodLabel,
  periodDays = 0,
  compareDays = 0,
}: Readonly<Props>) {
  const { translate } = useTranslate();

  const current = metric?.current ?? 0;
  const previous = metric?.previous ?? 0;
  const variation = metric?.variation_pct ?? null;
  const isPositive = (variation ?? 0) >= 0;

  const renderVariation = () => {
    if (metric?.is_new) {
      return (
        <Chip size="small" color="info" label={translate('dashboardModule.kpiMetrics.new')} />
      );
    }

    if (variation === null) {
      return null;
    }

    if (variation === 0) {
      return (
        <Typography variant="caption" color="text.secondary">
          {translate('dashboardModule.kpiMetrics.noChange')}
        </Typography>
      );
    }

    return (
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ color: isPositive ? 'success.main' : 'error.main' }}
      >
        <Iconify
          width={16}
          icon={isPositive ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
        />
        <Typography variant="subtitle2">
          {translate('dashboardModule.kpiMetrics.periodA')} {fPercent(Math.abs(variation))}{' '}
          {translate(
            isPositive
              ? 'dashboardModule.kpiMetrics.above'
              : 'dashboardModule.kpiMetrics.below'
          )}{' '}
          {translate('dashboardModule.kpiMetrics.periodB')}
        </Typography>
      </Stack>
    );
  };

  const sameDuration = periodDays === compareDays;
  const showDailyAverage = !sameDuration && additive && periodDays > 0 && compareDays > 0;

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ p: 2.5, height: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>
          <Skeleton width={96} height={36} />
        </Stack>
      </Card>
    );
  }

  if (!hasComparison) {
    return (
      <Card variant="outlined" sx={{ p: 2.5, height: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {formatValue(current, format)}
          </Typography>
          {periodLabel && (
            <Typography variant="caption" color="text.secondary">
              {periodLabel}
            </Typography>
          )}
        </Stack>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ p: 2.5, height: 1 }}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            columnGap: 1.5,
            alignItems: 'center',
          }}
        >
          <Box sx={{ minWidth: 0, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {translate('dashboardModule.kpiMetrics.periodA')}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }} noWrap>
              {formatValue(current, format)}
            </Typography>
          </Box>

          <Typography variant="overline" color="text.disabled">
            {translate('dashboardModule.kpiMetrics.vs')}
          </Typography>

          <Box sx={{ minWidth: 0, textAlign: 'left' }}>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {translate('dashboardModule.kpiMetrics.periodB')}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary' }} noWrap>
              {formatValue(previous, format)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderVariation()}

        {!sameDuration && periodDays > 0 && compareDays > 0 && (
          <Typography variant="caption" sx={{ color: 'warning.main' }}>
            {translate('dashboardModule.kpiMetrics.differentDuration')} ({periodDays}{' '}
            {translate('dashboardModule.kpiMetrics.days')} {translate('dashboardModule.kpiMetrics.vs')}{' '}
            {compareDays} {translate('dashboardModule.kpiMetrics.days')})
          </Typography>
        )}

        {showDailyAverage && (
          <Typography variant="caption" color="text.secondary">
            {translate('dashboardModule.kpiMetrics.dailyAverage')}:{' '}
            {formatValue(current / periodDays, format)} {translate('dashboardModule.kpiMetrics.vs')}{' '}
            {formatValue(previous / compareDays, format)}
          </Typography>
        )}
      </Stack>
    </Card>
  );
}
