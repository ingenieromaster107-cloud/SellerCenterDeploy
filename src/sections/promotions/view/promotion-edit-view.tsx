'use client';

import type { SellerPromotionDataRaw, CreateSellerPromotionInput } from 'src/interfaces/promotions';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';
import { useUpdateSellerPromotion } from 'src/actions/promotions/use-update-seller-promotion';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PromotionForm } from '../components/promotion-form';

// ----------------------------------------------------------------------

type Props = {
  promotion: SellerPromotionDataRaw;
};

export function PromotionEditView({ promotion }: Props) {
  const { translate } = useTranslate();
  const router = useRouter();

  const { mutate: updatePromotion, isPending } = useUpdateSellerPromotion({
    onSuccess: () => {
      toast.success(translate('promotionsModule.edit.successMessage'));
      router.push(paths.promotions.details(promotion.entity_id));
    },
    onError: () => {
      toast.error(translate('promotionsModule.edit.errorMessage'));
    },
  });

  const handleSubmit = (data: CreateSellerPromotionInput) => {
    updatePromotion({
      promotion_id: promotion.entity_id,
      input: {
        name: data.name,
        description: data.description,
        discount_amount: data.discount_amount,
        from_date: data.from_date,
        to_date: data.to_date,
        max_budget: data.max_budget,
        usage_limit: data.usage_limit,
        uses_per_customer: data.uses_per_customer,
        min_purchase_amount: data.min_purchase_amount,
        applies_to_all_products: data.applies_to_all_products,
        product_ids: data.product_ids,
        category_ids: data.category_ids,
      },
    });
  };

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate('promotionsModule.edit.heading')}
        links={[
          { name: translate('promotionsModule.breadcrumbs.home'), href: paths.home.root },
          { name: translate('promotionsModule.breadcrumbs.promotions'), href: paths.promotions.root },
          { name: translate('promotionsModule.breadcrumbs.edit') },
        ]}
        sx={{ mb: 3 }}
      />

      <PromotionForm
        mode="edit"
        initialValues={promotion}
        onSubmit={handleSubmit}
        onCancel={() => router.push(paths.promotions.details(promotion.entity_id))}
        isLoading={isPending}
      />
    </HomeContent>
  );
}
