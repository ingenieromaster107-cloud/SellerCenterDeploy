import type { MetricItem, LevelPalette } from '../app-reputation-panel';
import type { ReputationLevel } from 'src/interfaces/dashboard/seller-reputation-indicators';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Label, type LabelColor } from 'src/components/label';

const LEVEL_LABEL_COLOR: Record<ReputationLevel, LabelColor> = {
  GREEN: 'success',
  YELLOW: 'warning',
  RED: 'error',
  INSUFFICIENT_DATA: 'default',
};

type MetricCardProps = {
  readonly metric: MetricItem;
  readonly palettes: Record<ReputationLevel, LevelPalette>;
};

export const MetricCard = ({ metric, palettes }: MetricCardProps) => {
  const { translate } = useTranslate();
  const effectiveLevel: ReputationLevel = metric.level ?? 'INSUFFICIENT_DATA';
  const palette = palettes[effectiveLevel];

  const rateLabel =
    metric.rate === null
      ? '—'
      : metric.unit === 'percent'
        ? `${formatRate(metric.rate)}%`
        : `${formatRate(metric.rate)} h`;

  const chipLabel = translate(`reputationModule.levels.${effectiveLevel.toLowerCase()}`);

  const hasSuggestion = Boolean(metric.suggestion);
  const isNoData = metric.level === null;

  const renderFooter = () => {
    if (isNoData) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Iconify
            icon="solar:info-circle-bold"
            width={16}
            sx={{ color: palette.color, flexShrink: 0 }}
          />
          <Typography variant="caption" color="text.secondary">
            {translate('reputationModule.noData')}
          </Typography>
        </Box>
      );
    }

    if (hasSuggestion) {
      return (
        <Tooltip title={metric.suggestion ?? ''} placement="top" arrow>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
            <Iconify
              icon="solar:info-circle-bold"
              width={16}
              sx={{ color: palette.color, mt: '2px', flexShrink: 0 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {metric.suggestion}
            </Typography>
          </Box>
        </Tooltip>
      );
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Iconify
          icon="solar:check-circle-bold"
          width={16}
          sx={{ color: 'success.main', flexShrink: 0 }}
        />
        <Typography variant="caption" color="text.secondary">
          {translate('reputationModule.allGood')}
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        p: 3,
        height: 1,
        display: 'flex',
        alignItems: 'center',
        zIndex: 'unset',
        overflow: 'unset',
      }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ typography: 'subtitle2' }}>{metric.title}</Box>

        <Box sx={{ mt: 1.5, mb: 1, typography: 'h3' }}>{rateLabel}</Box>

        {renderFooter()}
      </Box>

      <Label
        variant="soft"
        color={LEVEL_LABEL_COLOR[effectiveLevel]}
        sx={{
          ml: 2,
          px: 1.5,
          py: 2,
          height: 'auto',
          fontSize: 14,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {chipLabel}
      </Label>
    </Card>
  );
};

// ----------------------------------------------------------------------

function formatRate(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}
