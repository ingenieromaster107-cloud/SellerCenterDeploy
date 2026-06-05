'use client';

import type { Dayjs } from 'dayjs';
import type {
  SellerPromotionDataRaw,
  SellerPromotionApplyType,
  CreateSellerPromotionInput,
  SellerPromotionDiscountType,
} from 'src/interfaces/promotions';

import { z } from 'zod';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

const buildSchema = (translate: (k: string) => string) =>
  z
    .object({
      name: z.string().min(1, translate('promotionsModule.form.validation.nameRequired')),
      description: z.string().optional(),
      discount_type: z.enum(['BY_PERCENT', 'BY_FIXED'], {
        error: translate('promotionsModule.form.validation.discountTypeRequired'),
      }),
      apply_type: z.enum(['AUTOMATIC', 'COUPON'], {
        error: translate('promotionsModule.form.validation.applyTypeRequired'),
      }),
      discount_amount: z
        .number({ error: translate('promotionsModule.form.validation.discountAmountPositive') })
        .positive(translate('promotionsModule.form.validation.discountAmountPositive')),
      coupon_code: z.string().optional(),
      from_date: z.string().min(1, translate('promotionsModule.form.validation.fromDateRequired')),
      to_date: z.string().optional(),
      max_budget: z.number().positive().optional().or(z.literal(undefined)),
      usage_limit: z.number().int().positive().optional().or(z.literal(undefined)),
      uses_per_customer: z.number().int().positive().optional().or(z.literal(undefined)),
      min_purchase_amount: z.number().positive().optional().or(z.literal(undefined)),
      applies_to_all_products: z.boolean(),
      product_ids_raw: z.string().optional(),
      category_ids_raw: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.apply_type === 'COUPON' && !data.coupon_code?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['coupon_code'],
          message: translate('promotionsModule.form.validation.couponCodeRequired'),
        });
      }
      if (data.discount_type === 'BY_PERCENT' && data.discount_amount > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['discount_amount'],
          message: translate('promotionsModule.form.validation.discountAmountMax'),
        });
      }
      if (data.to_date && data.from_date && data.to_date < data.from_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['to_date'],
          message: translate('promotionsModule.form.validation.toDateAfterFrom'),
        });
      }
    });

type FormValues = {
  name: string;
  description?: string;
  discount_type: SellerPromotionDiscountType;
  apply_type: SellerPromotionApplyType;
  discount_amount: number;
  coupon_code?: string;
  from_date: string;
  to_date?: string;
  max_budget?: number;
  usage_limit?: number;
  uses_per_customer?: number;
  min_purchase_amount?: number;
  applies_to_all_products: boolean;
  product_ids_raw?: string;
  category_ids_raw?: string;
};

type Props = {
  onSubmit: (data: CreateSellerPromotionInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  initialValues?: SellerPromotionDataRaw;
};

function parseIds(raw?: string): number[] | undefined {
  if (!raw?.trim()) return undefined;
  const ids = raw
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));
  return ids.length > 0 ? ids : undefined;
}

export function PromotionForm({ onSubmit, onCancel, isLoading = false, mode = 'create', initialValues }: Props) {
  const { translate } = useTranslate();
  const schema = buildSchema(translate);
  const isEdit = mode === 'edit';

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      discount_type: initialValues?.discount_type ?? 'BY_PERCENT',
      apply_type: initialValues?.apply_type ?? 'AUTOMATIC',
      discount_amount: initialValues?.discount_amount ?? 0,
      coupon_code: initialValues?.coupon_code ?? '',
      from_date: initialValues?.from_date ?? '',
      to_date: initialValues?.to_date ?? '',
      applies_to_all_products: initialValues?.applies_to_all_products ?? true,
      product_ids_raw: initialValues?.product_ids?.join(', ') ?? '',
      category_ids_raw: initialValues?.category_ids?.join(', ') ?? '',
    },
  });

  const applyType = watch('apply_type');
  const discountType = watch('discount_type');
  const appliesToAll = watch('applies_to_all_products');

  const handleFormSubmit = (values: FormValues) => {
    const payload: CreateSellerPromotionInput = {
      name: values.name,
      description: values.description || undefined,
      discount_type: values.discount_type,
      apply_type: values.apply_type,
      discount_amount: values.discount_amount,
      coupon_code: values.coupon_code || undefined,
      from_date: values.from_date,
      to_date: values.to_date || undefined,
      max_budget: values.max_budget,
      usage_limit: values.usage_limit,
      uses_per_customer: values.uses_per_customer,
      min_purchase_amount: values.min_purchase_amount,
      applies_to_all_products: values.applies_to_all_products,
      product_ids: values.applies_to_all_products ? undefined : parseIds(values.product_ids_raw),
      category_ids: values.applies_to_all_products ? undefined : parseIds(values.category_ids_raw),
    };
    onSubmit(payload);
  };

  const t = (key: string) => translate(key);

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Grid container spacing={3}>
        {/* Left column */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Basic info */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {t('promotionsModule.form.sections.basic')}
                </Typography>
                <Divider sx={{ mb: 2.5 }} />
                <Stack spacing={2.5}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('promotionsModule.form.fields.name')}
                        placeholder={t('promotionsModule.form.fields.namePh')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label={t('promotionsModule.form.fields.description')}
                        placeholder={t('promotionsModule.form.fields.descriptionPh')}
                      />
                    )}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Discount config */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {t('promotionsModule.form.sections.discount')}
                </Typography>
                <Divider sx={{ mb: 2.5 }} />
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="discount_type"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          disabled={isEdit}
                          label={t('promotionsModule.form.fields.discountType')}
                          error={!!errors.discount_type}
                          helperText={isEdit ? t('promotionsModule.edit.readonlyHint') : errors.discount_type?.message}
                        >
                          <MenuItem value="BY_PERCENT">
                            {t('promotionsModule.discountType.BY_PERCENT')}
                          </MenuItem>
                          <MenuItem value="BY_FIXED">
                            {t('promotionsModule.discountType.BY_FIXED')}
                          </MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="apply_type"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          disabled={isEdit}
                          label={t('promotionsModule.form.fields.applyType')}
                          error={!!errors.apply_type}
                          helperText={isEdit ? t('promotionsModule.edit.readonlyHint') : errors.apply_type?.message}
                        >
                          <MenuItem value="AUTOMATIC">
                            {t('promotionsModule.applyType.AUTOMATIC')}
                          </MenuItem>
                          <MenuItem value="COUPON">
                            {t('promotionsModule.applyType.COUPON')}
                          </MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="discount_amount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          fullWidth
                          type="number"
                          label={t('promotionsModule.form.fields.discountAmount')}
                          error={!!errors.discount_amount}
                          helperText={
                            errors.discount_amount?.message ||
                            t(
                              discountType === 'BY_PERCENT'
                                ? 'promotionsModule.form.hints.discountPercent'
                                : 'promotionsModule.form.hints.discountFixed'
                            )
                          }
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  {discountType === 'BY_PERCENT' ? '%' : '$'}
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {(applyType === 'COUPON' || (isEdit && initialValues?.apply_type === 'COUPON')) && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="coupon_code"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            disabled={isEdit}
                            label={t('promotionsModule.form.fields.couponCode')}
                            placeholder={t('promotionsModule.form.fields.couponCodePh')}
                            error={!!errors.coupon_code}
                            helperText={
                              isEdit
                                ? t('promotionsModule.edit.readonlyHint')
                                : errors.coupon_code?.message || t('promotionsModule.form.hints.couponRequired')
                            }
                          />
                        )}
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Scope */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {t('promotionsModule.form.sections.scope')}
                </Typography>
                <Divider sx={{ mb: 2.5 }} />
                <Stack spacing={2.5}>
                  <Controller
                    name="applies_to_all_products"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label={t('promotionsModule.form.fields.appliesToAllProducts')}
                      />
                    )}
                  />

                  {!appliesToAll && (
                    <>
                      <Controller
                        name="product_ids_raw"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={t('promotionsModule.form.fields.productIds')}
                            placeholder="101, 102, 103"
                          />
                        )}
                      />
                      <Controller
                        name="category_ids_raw"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={t('promotionsModule.form.fields.categoryIds')}
                            placeholder="5, 12"
                          />
                        )}
                      />
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right column */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Validity */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {t('promotionsModule.form.sections.limits')}
                </Typography>
                <Divider sx={{ mb: 2.5 }} />
                <Stack spacing={2.5}>
                  <Controller
                    name="from_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label={t('promotionsModule.form.fields.fromDate')}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(val: Dayjs | null) =>
                          field.onChange(val ? val.format('YYYY-MM-DD') : '')
                        }
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.from_date,
                            helperText: errors.from_date?.message,
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="to_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label={t('promotionsModule.form.fields.toDate')}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(val: Dayjs | null) =>
                          field.onChange(val ? val.format('YYYY-MM-DD') : '')
                        }
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.to_date,
                            helperText: errors.to_date?.message,
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="max_budget"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        value={field.value ?? ''}
                        fullWidth
                        type="number"
                        label={t('promotionsModule.form.fields.maxBudget')}
                        helperText={t('promotionsModule.form.hints.maxBudget')}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="usage_limit"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
                        }
                        value={field.value ?? ''}
                        fullWidth
                        type="number"
                        label={t('promotionsModule.form.fields.usageLimit')}
                        helperText={t('promotionsModule.form.hints.usageLimit')}
                      />
                    )}
                  />

                  <Controller
                    name="uses_per_customer"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
                        }
                        value={field.value ?? ''}
                        fullWidth
                        type="number"
                        label={t('promotionsModule.form.fields.usesPerCustomer')}
                        helperText={t('promotionsModule.form.hints.usesPerCustomer')}
                      />
                    )}
                  />

                  <Controller
                    name="min_purchase_amount"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        value={field.value ?? ''}
                        fullWidth
                        type="number"
                        label={t('promotionsModule.form.fields.minPurchaseAmount')}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          },
                        }}
                      />
                    )}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Actions */}
            <Stack direction="row" spacing={2}>
              <Button fullWidth variant="outlined" onClick={onCancel} disabled={isLoading}>
                {t('promotionsModule.form.actions.cancel')}
              </Button>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isLoading}
                loadingIndicator={t('promotionsModule.form.actions.saving')}
              >
                {t('promotionsModule.form.actions.save')}
              </LoadingButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
