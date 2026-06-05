'use client';

import type { CreateSellerPromotionInput } from 'src/interfaces/promotions';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';
import { useCreateSellerPromotion } from 'src/actions/promotions/use-create-seller-promotion';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PromotionForm } from '../components/promotion-form';

// ----------------------------------------------------------------------

export function PromotionCreateView() {
  const { translate } = useTranslate();
  const router = useRouter();

  const { mutate: createPromotion, isPending } = useCreateSellerPromotion({
    onSuccess: () => {
      toast.success(translate('promotionsModule.create.successMessage'));
      router.push(paths.promotions.root);
    },
    onError: () => {
      toast.error(translate('promotionsModule.create.errorMessage'));
    },
  });

  const handleSubmit = (data: CreateSellerPromotionInput) => {
    createPromotion(data);
  };

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate('promotionsModule.create.heading')}
        links={[
          { name: translate('promotionsModule.breadcrumbs.home'), href: paths.home.root },
          { name: translate('promotionsModule.breadcrumbs.promotions'), href: paths.promotions.root },
          { name: translate('promotionsModule.breadcrumbs.create') },
        ]}
        sx={{ mb: 3 }}
      />

      <PromotionForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(paths.promotions.root)}
        isLoading={isPending}
      />
    </HomeContent>
  );
}
