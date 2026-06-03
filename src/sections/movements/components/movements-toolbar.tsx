import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

type MovementsToolbarProps = {
  dateFrom: string;
  dateTo: string;
  onChange: (dateFrom: string, dateTo: string) => void;
  onExport: () => void;
  isExporting: boolean;
};

function isoFromDayjs(value: Dayjs | null): string | null {
  return value && value.isValid() ? value.format('YYYY-MM-DD') : null;
}

export function MovementsToolbar({
  dateFrom,
  dateTo,
  onChange,
  onExport,
  isExporting,
}: MovementsToolbarProps) {
  const { translate } = useTranslate();

  const [localFrom, setLocalFrom] = useState<Dayjs | null>(dayjs(dateFrom));
  const [localTo, setLocalTo] = useState<Dayjs | null>(dayjs(dateTo));

  const rangeIsValid =
    localFrom !== null &&
    localTo !== null &&
    localFrom.isValid() &&
    localTo.isValid() &&
    !localFrom.isAfter(localTo);

  const handleApply = useCallback(() => {
    const fromIso = isoFromDayjs(localFrom);
    const toIso = isoFromDayjs(localTo);
    if (fromIso && toIso) onChange(fromIso, toIso);
  }, [localFrom, localTo, onChange]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
      <DatePicker
        label={translate('movements.toolbar.dateFrom')}
        value={localFrom}
        onChange={setLocalFrom}
        format="YYYY-MM-DD"
        slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
      />

      <DatePicker
        label={translate('movements.toolbar.dateTo')}
        value={localTo}
        onChange={setLocalTo}
        format="YYYY-MM-DD"
        slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleApply}
        disabled={!rangeIsValid}
        startIcon={<Iconify icon="solar:calendar-date-bold" />}
      >
        {translate('movements.toolbar.apply')}
      </Button>

      <Button
        variant="outlined"
        color="inherit"
        onClick={onExport}
        disabled={isExporting || !rangeIsValid}
        startIcon={<Iconify icon="solar:export-bold" />}
      >
        {translate('movements.toolbar.exportCsv')}
      </Button>
    </Box>
  );
}
