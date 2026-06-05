'use client';

import type { SellerPromotionStatus } from 'src/interfaces/promotions';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';

import { PROMOTION_STATUS_COLORS } from '../resources/constants';

// ----------------------------------------------------------------------

type Props = {
  status: SellerPromotionStatus;
};

export function PromotionStatusChip({ status }: Props) {
  const { translate } = useTranslate();
  return (
    <Label color={PROMOTION_STATUS_COLORS[status]}>
      {translate(`promotionsModule.status.${status}`)}
    </Label>
  );
}
