import type { MovementCategory } from '../types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fDate, FORMAT_PATTERNS } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

type MovementsEmptyProps = {
  dateFrom?: string;
  dateTo?: string;
  activeCategories?: MovementCategory[];
};

export function MovementsEmpty({ dateFrom, dateTo, activeCategories = [] }: MovementsEmptyProps) {
  const { translate } = useTranslate();

  const hasCategoryFilter = activeCategories.length > 0;
  const categoryNames = activeCategories
    .map((category) => translate(`movements.category.${category}`))
    .join(', ');

  return (
    <Stack alignItems="center" spacing={1.25} sx={{ py: 4, px: 2 }}>
      <Box
        sx={(theme) => ({
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.grey[200],
          color: theme.palette.text.secondary,
        })}
      >
        <Iconify icon="solar:inbox-in-bold-duotone" width={32} />
      </Box>

      <Typography variant="h6">{translate('movements.empty.title')}</Typography>

      <Typography variant="body2" color="text.secondary" textAlign="center">
        {hasCategoryFilter
          ? translate('movements.empty.descriptionFiltered')
          : translate('movements.empty.description')}
      </Typography>

      {(dateFrom || dateTo) && (
        <Typography variant="caption" color="text.secondary" textAlign="center">
          {`${translate('movements.empty.periodLabel')}: ${fDate(dateFrom, FORMAT_PATTERNS.paramCase.date)} – ${fDate(dateTo, FORMAT_PATTERNS.paramCase.date)}`}
          {hasCategoryFilter
            ? ` · ${translate('movements.empty.typeLabel')}: ${categoryNames}`
            : ''}
        </Typography>
      )}

      <Typography variant="caption" color="text.disabled" textAlign="center">
        {translate('movements.empty.hint')}
      </Typography>
    </Stack>
  );
}
