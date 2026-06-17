import { sellerProductRankingAdapter } from './seller-product-ranking-adapter';

describe('sellerProductRankingAdapter', () => {
  it('returns empty ranking payload when source data is undefined', () => {
    const result = sellerProductRankingAdapter();

    expect(result).toEqual({ success: false, message: '', total_count: 0, data: [] });
  });

  it('falls back to safe defaults when total_count and data are null', () => {
    const source = {
      sellerProductRanking: { success: true, message: 'ok', total_count: null, data: null },
    };

    const result = sellerProductRankingAdapter(source as any);

    expect(result).toEqual({ success: true, message: 'ok', total_count: 0, data: [] });
  });

  it('returns provided ranking items when data is present', () => {
    const source = {
      sellerProductRanking: {
        success: true,
        message: 'ok',
        total_count: 1,
        data: [
          {
            product_id: 10,
            sku: 'SKU-10',
            product_name: 'Item',
            gross_sales: 100,
            units_sold: 5,
            visits: 20,
            participation: 35.5,
          },
        ],
      },
    };

    const result = sellerProductRankingAdapter(source as any);

    expect(result.total_count).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].sku).toBe('SKU-10');
  });
});
