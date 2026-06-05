'use client';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';
import { useGetSellerPromotionDetail } from 'src/actions/promotions/use-get-seller-promotion-detail';

import { ErrorContent } from 'src/components/error-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { PromotionDetailView } from './view/promotion-detail-view';

// ----------------------------------------------------------------------

export default function PromotionDetailClient({ promotionId }: { promotionId: number }) {
  const { translate } = useTranslate();
  const { promotion, stats, isLoading, isError } = useGetSellerPromotionDetail(promotionId);

  if (isLoading) {
    return <LoadingScreen sx={{}} slots={{}} slotsProps={{}} />;
  }

  if (isError || !promotion || !stats) {
    return (
      <HomeContent>
        <ErrorContent
          title={translate('promotionsModule.errors.notFound.title')}
          description={translate('promotionsModule.errors.notFound.description')}
          sx={{ mt: 10 }}
          slotProps={{}}
        />
      </HomeContent>
    );
  }

  return <PromotionDetailView promotion={promotion} stats={stats} />;
}
