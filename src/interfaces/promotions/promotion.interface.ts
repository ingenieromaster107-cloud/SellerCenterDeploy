export type SellerPromotionDiscountType = 'BY_PERCENT' | 'BY_FIXED';
export type SellerPromotionApplyType = 'AUTOMATIC' | 'COUPON';
export type SellerPromotionStatus =
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'PAUSED'
  | 'EXPIRED'
  | 'EXHAUSTED';

// ----------------------------------------------------------------------
export interface SellerPromotionDataRaw {
  entity_id: number;
  name: string;
  description?: string;
  discount_type: SellerPromotionDiscountType;
  apply_type: SellerPromotionApplyType;
  discount_amount: number;
  coupon_code?: string;
  from_date: string;
  to_date?: string;
  max_budget?: number;
  budget_spent: number;
  usage_limit?: number;
  uses_per_customer: number;
  times_used: number;
  min_purchase_amount?: number;
  applies_to_all_products: boolean;
  status: SellerPromotionStatus;
  product_ids?: number[];
  category_ids?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface SellerPromotionStatsDataRaw {
  times_used: number;
  total_discount_granted: number;
  total_revenue_generated: number;
}

export interface SellerPromotionsResponseRaw {
  sellerPromotions: {
    items: SellerPromotionDataRaw[];
    total_count: number;
    page_size: number;
    current_page: number;
  };
}

export interface SellerPromotionDetailResponseRaw {
  sellerPromotion: {
    promotion: SellerPromotionDataRaw;
    stats: SellerPromotionStatsDataRaw;
  };
}

export interface SellerPromotionMutationResponseRaw {
  promotion: SellerPromotionDataRaw;
  success: boolean;
  message?: string;
}

export interface SellerPromotionDeleteResponseRaw {
  success: boolean;
  message?: string;
}

export interface ValidateSellerCouponResponseRaw {
  validateSellerCoupon: {
    is_valid: boolean;
    promotion?: SellerPromotionDataRaw;
    discount_preview?: number;
    message?: string;
  };
}

export interface CreateSellerPromotionInput {
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
  product_ids?: number[];
  category_ids?: number[];
}

export interface UpdateSellerPromotionInput {
  name?: string;
  description?: string;
  discount_amount?: number;
  from_date?: string;
  to_date?: string;
  max_budget?: number;
  usage_limit?: number;
  uses_per_customer?: number;
  min_purchase_amount?: number;
  applies_to_all_products?: boolean;
  product_ids?: number[];
  category_ids?: number[];
}

export interface SellerPromotionFilterInput {
  status?: SellerPromotionStatus;
  apply_type?: SellerPromotionApplyType;
  from_date?: string;
  to_date?: string;
}
