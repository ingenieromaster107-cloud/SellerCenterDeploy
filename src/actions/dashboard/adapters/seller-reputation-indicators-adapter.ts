import type {
  SellerReputationIndicatorsData,
  SellerReputationIndicatorsPayload,
  SellerReputationIndicatorsResponse,
} from 'src/interfaces/dashboard/seller-reputation-indicators';

const EMPTY_REPUTATION_DATA: SellerReputationIndicatorsData = {
  reputation_level: 'INSUFFICIENT_DATA',
  insufficient_data: true,
  completed_sales: 0,

  cancellation_rate: null,
  cancellation_level: null,
  cancellation_suggestion: null,

  claims_rate: null,
  claims_level: null,
  claims_suggestion: null,

  on_time_dispatch_rate: null,
  on_time_dispatch_level: null,
  on_time_dispatch_suggestion: null,

  avg_response_time: null,
  avg_response_time_level: null,
  avg_response_time_suggestion: null,

  period_from: '',
  period_to: '',
  calculated_at: '',
};

export function sellerReputationIndicatorsAdapter(
  data?: SellerReputationIndicatorsResponse
): SellerReputationIndicatorsPayload {
  if (!data?.sellerReputationIndicators) {
    return {
      success: false,
      message: '',
      data: EMPTY_REPUTATION_DATA,
    };
  }

  return {
    ...data.sellerReputationIndicators,
    data: data.sellerReputationIndicators.data ?? EMPTY_REPUTATION_DATA,
  };
}
