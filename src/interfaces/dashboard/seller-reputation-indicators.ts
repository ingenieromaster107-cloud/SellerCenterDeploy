export type ReputationLevel = 'GREEN' | 'YELLOW' | 'RED' | 'INSUFFICIENT_DATA';

export interface SellerReputationIndicatorsResponse {
  sellerReputationIndicators?: SellerReputationIndicatorsPayload;
}

export interface SellerReputationIndicatorsPayload {
  success: boolean;
  message: string;
  data: SellerReputationIndicatorsData | null;
}

export interface SellerReputationIndicatorsData {
  reputation_level: ReputationLevel;
  insufficient_data: boolean;
  completed_sales: number;

  cancellation_rate: number | null;
  cancellation_level: ReputationLevel | null;
  cancellation_suggestion: string | null;

  claims_rate: number | null;
  claims_level: ReputationLevel | null;
  claims_suggestion: string | null;

  on_time_dispatch_rate: number | null;
  on_time_dispatch_level: ReputationLevel | null;
  on_time_dispatch_suggestion: string | null;

  avg_response_time: number | null;
  avg_response_time_level: ReputationLevel | null;
  avg_response_time_suggestion: string | null;

  period_from: string;
  period_to: string;
  calculated_at: string;
}
