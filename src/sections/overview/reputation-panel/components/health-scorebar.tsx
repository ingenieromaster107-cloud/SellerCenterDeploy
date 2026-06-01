import type { LevelPalette } from '../app-reputation-panel';
import type { ReputationLevel } from 'src/interfaces/dashboard/seller-reputation-indicators';

import { alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

type HealthScoreBarProps = {
  readonly level: ReputationLevel;
  readonly palettes: Record<ReputationLevel, LevelPalette>;
};

const LEVEL_FILL_PERCENT: Record<ReputationLevel, number> = {
  RED: 25,
  YELLOW: 55,
  GREEN: 85,
  INSUFFICIENT_DATA: 0,
};

export const HealthScoreBar = ({ level, palettes }: HealthScoreBarProps) => {
  const { translate } = useTranslate();
  const palette = palettes[level];
  const fillPercent = LEVEL_FILL_PERCENT[level];

  const labelStyle = {
    color: 'text.secondary',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: 0.5,
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        {translate('reputationModule.healthScore')}
      </Typography>

      <Box
        sx={(t) => ({
          height: 10,
          borderRadius: 5,
          backgroundColor: alpha(t.palette.grey[500], 0.16),
          overflow: 'hidden',
          mb: 1,
        })}
      >
        <Box
          sx={{
            height: '100%',
            width: `${fillPercent}%`,
            backgroundColor: palette.color,
            borderRadius: 5,
            transition: 'width 0.4s ease',
          }}
        />
      </Box>

      <Box sx={{ position: 'relative', height: 18 }}>
        <Typography variant="caption" sx={{ position: 'absolute', left: 0, ...labelStyle }}>
          {translate('reputationModule.levels.red')}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            ...labelStyle,
          }}
        >
          {translate('reputationModule.levels.yellow')}
        </Typography>
        <Typography variant="caption" sx={{ position: 'absolute', right: 0, ...labelStyle }}>
          {translate('reputationModule.levels.green')}
        </Typography>
      </Box>
    </Box>
  );
};
