'use client';

import type { ProductPromotionInterface } from 'src/interfaces';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  promotions: ProductPromotionInterface[];
};

export function ProductPromotions({ promotions }: Props) {
  const { translate } = useTranslate();

  if (!promotions?.length) {
    return null;
  }

  const formatDiscount = (promo: ProductPromotionInterface) =>
    promo.discount_type === 'BY_PERCENT'
      ? `${promo.discount_amount}%`
      : fCurrency(promo.discount_amount);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Iconify icon="solar:tag-price-bold" width={20} sx={{ color: 'info.main' }} />
        <Typography variant="subtitle1">
          {translate('productDetails', 'promotions.title')}
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        {promotions.map((promo) => (
          <Paper
            key={promo.promotion_id}
            variant="outlined"
            sx={{ p: 2, borderRadius: 1.5, borderColor: 'info.light' }}
          >
            <Stack spacing={1.25}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Typography variant="subtitle2" noWrap>
                  {promo.name}
                </Typography>
                <Chip
                  size="small"
                  color={promo.apply_type === 'COUPON' ? 'info' : 'default'}
                  label={translate(`promotionsModule.applyType.${promo.apply_type}`)}
                />
              </Stack>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
                <Chip
                  size="small"
                  variant="outlined"
                  label={translate(`promotionsModule.discountType.${promo.discount_type}`)}
                />

                <Chip
                  size="small"
                  color="info"
                  icon={
                    <Iconify
                      icon={
                        promo.discount_type === 'BY_PERCENT'
                          ? 'solar:tag-price-bold'
                          : 'solar:wad-of-money-bold'
                      }
                      width={16}
                    />
                  }
                  label={`${translate('productDetails', 'promotions.discount')}: ${formatDiscount(promo)}`}
                />

                {promo.apply_type === 'COUPON' && promo.coupon_code && (
                  <Chip
                    size="small"
                    color="info"
                    variant="outlined"
                    icon={<Iconify icon="solar:bill-list-bold" width={16} />}
                    label={`${translate('productDetails', 'promotions.coupon')}: ${promo.coupon_code}`}
                  />
                )}
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

export default ProductPromotions;
