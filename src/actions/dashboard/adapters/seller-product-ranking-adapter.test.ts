import type {
  SellerProductRankingItem,
  SellerProductRankingResponse,
} from 'src/interfaces/dashboard/seller-product-ranking';

import { sellerProductRankingAdapter } from './seller-product-ranking-adapter';

const RANKING_ITEM: SellerProductRankingItem = {
  product_id: 10,
  sku: 'SKU-10',
  product_name: 'Widget',
  gross_sales: 500,
  units_sold: 20,
  visits: 150,
  participation: 35.5,
};

const VALID_RESPONSE: SellerProductRankingResponse = {
  sellerProductRanking: {
    success: true,
    message: 'ok',
    total_count: 1,
    data: [RANKING_ITEM],
  },
};

describe('sellerProductRankingAdapter', () => {
  describe('when input is falsy or sellerProductRanking is absent', () => {
    it('returns empty default when called with no argument', () => {
      const result = sellerProductRankingAdapter();
      expect(result).toEqual({ success: false, message: '', total_count: 0, data: [] });
    });

    it('returns empty default when called with null', () => {
      const result = sellerProductRankingAdapter(null as unknown as SellerProductRankingResponse);
      expect(result).toEqual({ success: false, message: '', total_count: 0, data: [] });
    });

    it('returns empty default when sellerProductRanking key is absent', () => {
      const result = sellerProductRankingAdapter({} as SellerProductRankingResponse);
      expect(result).toEqual({ success: false, message: '', total_count: 0, data: [] });
    });

    it('returns empty default when sellerProductRanking is null', () => {
      const result = sellerProductRankingAdapter({ sellerProductRanking: null as any });
      expect(result).toEqual({ success: false, message: '', total_count: 0, data: [] });
    });
  });

  describe('when total_count or data are null inside a present payload', () => {
    it('falls back total_count to 0 when the field is null', () => {
      const response = {
        sellerProductRanking: { success: true, message: 'ok', total_count: null, data: [RANKING_ITEM] },
      } as unknown as SellerProductRankingResponse;
      expect(sellerProductRankingAdapter(response).total_count).toBe(0);
    });

    it('falls back data to empty array when the field is null', () => {
      const response = {
        sellerProductRanking: { success: true, message: 'ok', total_count: 1, data: null },
      } as unknown as SellerProductRankingResponse;
      expect(sellerProductRankingAdapter(response).data).toEqual([]);
    });

    it('returns zeros/empty when both total_count and data are null', () => {
      const response = {
        sellerProductRanking: { success: true, message: 'ok', total_count: null, data: null },
      } as unknown as SellerProductRankingResponse;
      expect(sellerProductRankingAdapter(response)).toEqual({
        success: true,
        message: 'ok',
        total_count: 0,
        data: [],
      });
    });
  });

  describe('when input contains a valid payload', () => {
    it('returns success true', () => {
      expect(sellerProductRankingAdapter(VALID_RESPONSE).success).toBe(true);
    });

    it('returns the message from the payload', () => {
      expect(sellerProductRankingAdapter(VALID_RESPONSE).message).toBe('ok');
    });

    it('returns the correct total_count', () => {
      expect(sellerProductRankingAdapter(VALID_RESPONSE).total_count).toBe(1);
    });

    it('returns the data array with correct items', () => {
      const result = sellerProductRankingAdapter(VALID_RESPONSE);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].sku).toBe('SKU-10');
      expect(result.data[0].gross_sales).toBe(500);
    });

    it('propagates success false from the API response', () => {
      const response: SellerProductRankingResponse = {
        sellerProductRanking: { success: false, message: 'error', total_count: 0, data: [] },
      };
      expect(sellerProductRankingAdapter(response).success).toBe(false);
    });
  });
});
