import type { CardProps } from '@mui/material/Card';
import type {
  ReputationLevel,
  SellerReputationIndicatorsData,
} from 'src/interfaces/dashboard/seller-reputation-indicators';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { formatPeriod } from 'src/utils';
import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { MetricCard, HealthScoreBar } from './components';

// ----------------------------------------------------------------------

type Props = CardProps & {
  readonly data: SellerReputationIndicatorsData | null;
};

export type LevelPalette = {
  color: string;
  contrastText: string;
  soft: string;
};

export type MetricItem = {
  key: string;
  title: string;
  rate: number | null;
  level: ReputationLevel | null;
  suggestion: string | null;
  unit: 'percent' | 'hours';
};

const STATE_ICONS: Record<ReputationLevel, React.ComponentProps<typeof Iconify>['icon']> = {
  RED: 'solar:danger-triangle-bold',
  YELLOW: 'solar:bell-bing-bold',
  GREEN: 'solar:shield-check-bold',
  INSUFFICIENT_DATA: 'solar:info-circle-bold',
};

// ----------------------------------------------------------------------

export function AppReputationPanel({ data, sx, ...other }: Props) {
  const theme = useTheme();
  const { translate } = useTranslate();

  const levelPalettes: Record<ReputationLevel, LevelPalette> = {
    GREEN: {
      color: theme.palette.success.main,
      contrastText: theme.palette.success.contrastText,
      soft: alpha(theme.palette.success.main, 0.16),
    },
    YELLOW: {
      color: theme.palette.warning.main,
      contrastText: theme.palette.warning.contrastText,
      soft: alpha(theme.palette.warning.main, 0.16),
    },
    RED: {
      color: theme.palette.error.main,
      contrastText: theme.palette.error.contrastText,
      soft: alpha(theme.palette.error.main, 0.16),
    },
    INSUFFICIENT_DATA: {
      color: theme.palette.grey[500],
      contrastText: theme.palette.common.white,
      soft: alpha(theme.palette.grey[500], 0.16),
    },
  };

  const overallLevel: ReputationLevel = data?.reputation_level ?? 'INSUFFICIENT_DATA';
  const overallPalette = levelPalettes[overallLevel];

  const overallLabel = translate(`reputationModule.levels.${overallLevel.toLowerCase()}`);

  const metrics: MetricItem[] = [
    {
      key: 'cancellation',
      title: translate('reputationModule.metrics.cancellation.title'),
      rate: data?.cancellation_rate ?? null,
      level: data?.cancellation_level ?? null,
      suggestion: data?.cancellation_suggestion ?? null,
      unit: 'percent',
    },
    {
      key: 'claims',
      title: translate('reputationModule.metrics.claims.title'),
      rate: data?.claims_rate ?? null,
      level: data?.claims_level ?? null,
      suggestion: data?.claims_suggestion ?? null,
      unit: 'percent',
    },
    {
      key: 'onTimeDispatch',
      title: translate('reputationModule.metrics.onTimeDispatch.title'),
      rate: data?.on_time_dispatch_rate ?? null,
      level: data?.on_time_dispatch_level ?? null,
      suggestion: data?.on_time_dispatch_suggestion ?? null,
      unit: 'percent',
    },
    {
      key: 'avgResponseTime',
      title: translate('reputationModule.metrics.avgResponseTime.title'),
      rate: data?.avg_response_time ?? null,
      level: data?.avg_response_time_level ?? null,
      suggestion: data?.avg_response_time_suggestion ?? null,
      unit: 'hours',
    },
  ];

  const subheaderText =
    data?.period_from && data?.period_to
      ? `${translate('reputationModule.period')}: ${formatPeriod(data.period_from)} - ${formatPeriod(data.period_to)}`
      : undefined;

  return (
    <Card sx={sx} {...other} className="reputation-panel">
      <CardHeader title={translate('reputationModule.title')} subheader={subheaderText} />

      <Box sx={{ p: 3, pt: 1 }}>
        <Box
          sx={(t) => ({
            p: { xs: 3, md: 4 },
            mb: 3,
            borderRadius: 2,
            border: `1px solid ${t.palette.divider}`,
            background: `linear-gradient(135deg, ${alpha(overallPalette.color, 0.06)} 0%, transparent 65%)`,
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: overallPalette.color,
                color: overallPalette.contrastText,
                flexShrink: 0,
              }}
            >
              <Iconify icon={STATE_ICONS[overallLevel]} width={18} />
            </Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 0.5 }}>
              {translate('reputationModule.overall.label')}
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ mb: 1 }}>
            {translate('reputationModule.title')}:{' '}
            <Box component="span" sx={{ color: overallPalette.color }}>
              {overallLabel}
            </Box>
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {translate('reputationModule.completedSales')}: {data?.completed_sales ?? 0}
          </Typography>

          <HealthScoreBar level={overallLevel} palettes={levelPalettes} />
        </Box>

        <Grid container spacing={3}>
          {metrics.map((metric) => (
            <Grid key={metric.key} size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard metric={metric} palettes={levelPalettes} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
}
