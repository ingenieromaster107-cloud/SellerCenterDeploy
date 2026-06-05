'use client';

import type { SellerPromotionStatus } from 'src/interfaces/promotions';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: SellerPromotionStatus | 'all';
  onStatusChange: (value: SellerPromotionStatus | 'all') => void;
};

const STATUS_OPTIONS: Array<SellerPromotionStatus | 'all'> = [
  'all',
  'ACTIVE',
  'PAUSED',
  'PENDING_APPROVAL',
  'EXPIRED',
  'EXHAUSTED',
];

export function PromotionTableToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: Props) {
  const { translate } = useTranslate();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ sm: 'center' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <OutlinedInput
        fullWidth
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={translate('promotionsModule.table.searchFilter')}
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
        sx={{
          maxWidth: { sm: 320 },
          [`& .${inputBaseClasses.input}`]: { py: 0.75 },
        }}
      />

      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel>{translate('promotionsModule.table.columns.status')}</InputLabel>
        <Select
          value={statusFilter}
          label={translate('promotionsModule.table.columns.status')}
          onChange={(e) => onStatusChange(e.target.value as SellerPromotionStatus | 'all')}
        >
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>
              {translate(`promotionsModule.status.${s}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
