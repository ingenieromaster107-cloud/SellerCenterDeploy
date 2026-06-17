export type LoyaltyClassification = 'FREQUENT' | 'NEW';

export interface SellerLoyaltyCustomer {
  full_name: string;
  email: string;
  orders_count: number;
  classification: LoyaltyClassification;
}

export interface SellerLoyaltyData {
  total_customers: number;
  new_customers: number;
  frequent_customers: number;
  loyalty_rate: number;
  customers: SellerLoyaltyCustomer[];
}

export interface SellerLoyaltyResult {
  success: boolean;
  message: string;
  data: SellerLoyaltyData;
}

export interface SellerLoyaltyResponse {
  sellerCustomerLoyalty: {
    success: boolean;
    message: string;
    data: SellerLoyaltyData | null;
  };
}
