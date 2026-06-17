export interface SellerProductRankingItem {
  product_id: number;
  sku: string;
  product_name: string;
  gross_sales: number;
  units_sold: number;
  visits: number;
  participation: number;
}

export interface SellerProductRankingResult {
  success: boolean;
  message: string;
  total_count: number;
  data: SellerProductRankingItem[];
}

export interface SellerProductRankingResponse {
  sellerProductRanking: {
    success: boolean;
    message: string;
    total_count: number | null;
    data: SellerProductRankingItem[] | null;
  };
}
