'use client';

import type { SellerPromotionDataRaw } from 'src/interfaces/promotions';

import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { PromotionStatusChip } from './promotion-status-chip';

// ----------------------------------------------------------------------

type Props = {
  row: SellerPromotionDataRaw;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onPause: (id: number) => void;
  onActivate: (id: number) => void;
  onDelete: (id: number) => void;
};

export function PromotionTableRow({ row, onView, onEdit, onPause, onActivate, onDelete }: Props) {
  const { translate } = useTranslate();

  const discountLabel =
    row.discount_type === 'BY_PERCENT'
      ? `${row.discount_amount}%`
      : `$${row.discount_amount.toFixed(2)}`;

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2" fontWeight={500} noWrap>
          {row.name}
        </Typography>
        {row.coupon_code && (
          <Typography variant="caption" color="text.secondary">
            {row.coupon_code}
          </Typography>
        )}
      </TableCell>

      <TableCell>{translate(`promotionsModule.discountType.${row.discount_type}`)}</TableCell>

      <TableCell>{translate(`promotionsModule.applyType.${row.apply_type}`)}</TableCell>

      <TableCell>{discountLabel}</TableCell>

      <TableCell>{fDate(row.from_date)}</TableCell>

      <TableCell>{row.to_date ? fDate(row.to_date) : '—'}</TableCell>

      <TableCell align="center">{row.times_used}</TableCell>

      <TableCell>
        <PromotionStatusChip status={row.status} />
      </TableCell>

      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        <Tooltip title={translate('promotionsModule.actions.viewDetail')}>
          <IconButton size="small" onClick={() => onView(row.entity_id)}>
            <Iconify icon="solar:eye-bold" width={18} />
          </IconButton>
        </Tooltip>

        <Tooltip title={translate('promotionsModule.actions.edit')}>
          <IconButton size="small" color="info" onClick={() => onEdit(row.entity_id)}>
            <Iconify icon="solar:pen-bold" width={18} />
          </IconButton>
        </Tooltip>

        {row.status === 'ACTIVE' && (
          <Tooltip title={translate('promotionsModule.actions.pause')}>
            <IconButton size="small" onClick={() => onPause(row.entity_id)}>
              <Iconify icon="solar:stop-circle-bold" width={18} />
            </IconButton>
          </Tooltip>
        )}

        {(row.status === 'PAUSED' || row.status === 'PENDING_APPROVAL') && (
          <Tooltip title={translate('promotionsModule.actions.activate')}>
            <IconButton size="small" color="success" onClick={() => onActivate(row.entity_id)}>
              <Iconify icon="solar:play-circle-bold" width={18} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={translate('promotionsModule.actions.delete')}>
          <IconButton size="small" color="error" onClick={() => onDelete(row.entity_id)}>
            <Iconify icon="solar:trash-bin-trash-bold" width={18} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
