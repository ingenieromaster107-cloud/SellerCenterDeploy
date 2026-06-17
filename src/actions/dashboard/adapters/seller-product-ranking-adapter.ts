import type {
  SellerProductRankingResult,
  SellerProductRankingResponse,
} from 'src/interfaces/dashboard/seller-product-ranking';

export function sellerProductRankingAdapter(
  data?: SellerProductRankingResponse
): SellerProductRankingResult {
  const payload = data?.sellerProductRanking;

  if (!payload) {
    return { success: false, message: '', total_count: 0, data: [] };
  }

  return {
    success: payload.success,
    message: payload.message,
    total_count: payload.total_count ?? 0,
    data: payload.data ?? [],
  };
}
