'use client';

import type { SellerPromotionDataRaw, SellerPromotionStatsDataRaw } from 'src/interfaces/promotions';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PromotionStatusChip } from '../components/promotion-status-chip';

// ----------------------------------------------------------------------

type Props = {
  promotion: SellerPromotionDataRaw;
  stats: SellerPromotionStatsDataRaw;
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card sx={{ flex: 1, textAlign: 'center' }}>
      <CardContent>
        <Typography variant="h4">{value}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" py={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} textAlign="right">
        {value}
      </Typography>
    </Stack>
  );
}

export function PromotionDetailView({ promotion, stats }: Props) {
  const { translate } = useTranslate();
  const t = (k: string) => translate(k);

  const discountLabel =
    promotion.discount_type === 'BY_PERCENT'
      ? `${promotion.discount_amount}%`
      : fCurrency(promotion.discount_amount);

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={promotion.name}
        links={[
          { name: t('promotionsModule.breadcrumbs.home'), href: paths.home.root },
          { name: t('promotionsModule.breadcrumbs.promotions'), href: paths.promotions.root },
          { name: t('promotionsModule.breadcrumbs.detail') },
        ]}
        sx={{ mb: 3 }}
      />

      {/* Stats */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <StatCard
          label={t('promotionsModule.detail.timesUsed')}
          value={stats.times_used}
        />
        <StatCard
          label={t('promotionsModule.detail.totalDiscountGranted')}
          value={fCurrency(stats.total_discount_granted)}
        />
        <StatCard
          label={t('promotionsModule.detail.totalRevenueGenerated')}
          value={fCurrency(stats.total_revenue_generated)}
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader
              title={t('promotionsModule.detail.heading')}
              action={<PromotionStatusChip status={promotion.status} />}
            />
            <CardContent>
              {promotion.description && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {promotion.description}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </>
              )}

              <InfoRow
                label={t('promotionsModule.table.columns.discountType')}
                value={t(`promotionsModule.discountType.${promotion.discount_type}`)}
              />
              <Divider />
              <InfoRow
                label={t('promotionsModule.table.columns.applyType')}
                value={t(`promotionsModule.applyType.${promotion.apply_type}`)}
              />
              <Divider />
              <InfoRow
                label={t('promotionsModule.table.columns.discountAmount')}
                value={discountLabel}
              />
              {promotion.coupon_code && (
                <>
                  <Divider />
                  <InfoRow
                    label={t('promotionsModule.form.fields.couponCode')}
                    value={
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          bgcolor: 'action.selected',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                        }}
                      >
                        {promotion.coupon_code}
                      </Typography>
                    }
                  />
                </>
              )}
              <Divider />
              <InfoRow
                label={t('promotionsModule.table.columns.fromDate')}
                value={fDate(promotion.from_date)}
              />
              {promotion.to_date && (
                <>
                  <Divider />
                  <InfoRow
                    label={t('promotionsModule.table.columns.toDate')}
                    value={fDate(promotion.to_date)}
                  />
                </>
              )}
              {promotion.max_budget !== undefined && promotion.max_budget !== null && (
                <>
                  <Divider />
                  <InfoRow
                    label={t('promotionsModule.form.fields.maxBudget')}
                    value={`${fCurrency(promotion.budget_spent)} / ${fCurrency(promotion.max_budget)}`}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title={t('promotionsModule.form.sections.limits')} />
            <CardContent>
              {promotion.usage_limit !== undefined && promotion.usage_limit !== null && (
                <>
                  <InfoRow
                    label={t('promotionsModule.form.fields.usageLimit')}
                    value={`${promotion.times_used} / ${promotion.usage_limit}`}
                  />
                  <Divider />
                </>
              )}
              <InfoRow
                label={t('promotionsModule.form.fields.usesPerCustomer')}
                value={promotion.uses_per_customer}
              />
              {promotion.min_purchase_amount !== undefined && promotion.min_purchase_amount !== null && (
                <>
                  <Divider />
                  <InfoRow
                    label={t('promotionsModule.form.fields.minPurchaseAmount')}
                    value={fCurrency(promotion.min_purchase_amount)}
                  />
                </>
              )}
              <Divider />
              <InfoRow
                label={t('promotionsModule.form.fields.appliesToAllProducts')}
                value={promotion.applies_to_all_products ? '✓' : '—'}
              />
              {promotion.created_at && (
                <>
                  <Divider />
                  <InfoRow
                    label={t('createdAt')}
                    value={fDate(promotion.created_at)}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </HomeContent>
  );
}
