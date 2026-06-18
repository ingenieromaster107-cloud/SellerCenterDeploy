import Stack from '@mui/system/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: TemplateStatusVariant;
  onStatusChange: (value: TemplateStatusVariant) => void;
};

export type TemplateStatusVariant =
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'PAUSED'
  | 'EXPIRED'
  | 'EXHAUSTED'
  | 'INACTIVE'
  | 'all';

export function TemplateTableToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: Props) {
  const { translate } = useTranslate();

  const STATUS_OPTIONS: Array<{ value: TemplateStatusVariant; label: string }> = [
    { value: 'all', label: translate('responseTemplates.status.all') },
    { value: 'ACTIVE', label: translate('responseTemplates.status.active') },
    { value: 'INACTIVE', label: translate('responseTemplates.status.inactive') },
  ];

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
        placeholder={translate('responseTemplates.searchFilter')}
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
      <FormControl>
        <InputLabel>{translate('responseTemplates.statusLabel')}</InputLabel>
        <Select
          value={statusFilter}
          label={translate('responseTemplates.statusLabel')}
          onChange={(e) => onStatusChange(e.target.value as TemplateStatusVariant)}
        >
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
