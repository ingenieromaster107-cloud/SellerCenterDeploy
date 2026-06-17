import type {
  SellerLoyaltyData,
  SellerLoyaltyResult,
  SellerLoyaltyResponse,
  LoyaltyClassification,
} from 'src/interfaces/clients/seller-loyalty';

const EMPTY_LOYALTY_DATA: SellerLoyaltyData = {
  total_customers: 0,
  new_customers: 0,
  frequent_customers: 0,
  loyalty_rate: 0,
  customers: [],
};

function normalizeClassification(raw: string): LoyaltyClassification {
  const value = raw.trim().toUpperCase();
  return value.startsWith('FREC') || value.startsWith('FREQ') ? 'FREQUENT' : 'NEW';
}

export function sellerLoyaltyAdapter(data?: SellerLoyaltyResponse): SellerLoyaltyResult {
  const payload = data?.sellerCustomerLoyalty;

  if (!payload?.data) {
    return { success: false, message: payload?.message ?? '', data: EMPTY_LOYALTY_DATA };
  }

  return {
    success: payload.success,
    message: payload.message,
    data: {
      ...payload.data,
      customers: payload.data.customers.map((customer) => ({
        ...customer,
        classification: normalizeClassification(String(customer.classification)),
      })),
    },
  };
}
