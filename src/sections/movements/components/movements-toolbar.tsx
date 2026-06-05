import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { MAX_RANGE_DAYS } from '../constants';

type MovementsToolbarProps = {
  dateFrom: string;
  dateTo: string;
  onChange: (dateFrom: string, dateTo: string) => void;
  onExport: () => void;
  isExporting: boolean;
  exportLimitExceeded: boolean;
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
  exportLimitExceeded,
}: MovementsToolbarProps) {
  const { translate } = useTranslate();

  const [localFrom, setLocalFrom] = useState<Dayjs | null>(dayjs(dateFrom));
  const [localTo, setLocalTo] = useState<Dayjs | null>(dayjs(dateTo));

  // Ajusta el extremo opuesto para no exceder el rango permitido por el back.
  const handleFromChange = useCallback(
    (value: Dayjs | null) => {
      setLocalFrom(value);
      if (!value?.isValid() || !localTo) return;
      if (localTo.isBefore(value, 'day')) {
        setLocalTo(value);
      } else if (localTo.diff(value, 'day') > MAX_RANGE_DAYS) {
        setLocalTo(value.add(MAX_RANGE_DAYS, 'day'));
      }
    },
    [localTo]
  );

  const handleToChange = useCallback(
    (value: Dayjs | null) => {
      setLocalTo(value);
      if (!value?.isValid() || !localFrom) return;
      if (localFrom.isAfter(value, 'day')) {
        setLocalFrom(value);
      } else if (value.diff(localFrom, 'day') > MAX_RANGE_DAYS) {
        setLocalFrom(value.subtract(MAX_RANGE_DAYS, 'day'));
      }
    },
    [localFrom]
  );

  const rangeIsValid =
    localFrom !== null &&
    localTo !== null &&
    localFrom.isValid() &&
    localTo.isValid() &&
    !localFrom.isAfter(localTo) &&
    localTo.diff(localFrom, 'day') <= MAX_RANGE_DAYS;

  // Límites del calendario: cada extremo se acota a MAX_RANGE_DAYS del otro.
  const toMaxDate = localFrom?.isValid() ? localFrom.add(MAX_RANGE_DAYS, 'day') : undefined;
  const fromMinDate = localTo?.isValid() ? localTo.subtract(MAX_RANGE_DAYS, 'day') : undefined;

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
        onChange={handleFromChange}
        format="YYYY-MM-DD"
        minDate={fromMinDate}
        maxDate={localTo?.isValid() ? localTo : undefined}
        disableFuture
        slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
      />

      <DatePicker
        label={translate('movements.toolbar.dateTo')}
        value={localTo}
        onChange={handleToChange}
        format="YYYY-MM-DD"
        minDate={localFrom?.isValid() ? localFrom : undefined}
        maxDate={toMaxDate}
        disableFuture
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

      <Tooltip title={exportLimitExceeded ? translate('movements.export.limitExceeded') : ''}>
        <span>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onExport}
            disabled={isExporting || !rangeIsValid || exportLimitExceeded}
            startIcon={<Iconify icon="solar:export-bold" />}
          >
            {translate('movements.toolbar.exportCsv')}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
}
