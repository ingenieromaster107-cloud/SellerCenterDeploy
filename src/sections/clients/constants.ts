import type { LabelColor } from 'src/components/label';
import type { LoyaltyClassification } from 'src/interfaces/clients/seller-loyalty';

type ClassificationConfig = {
  labelKey: string;
  color: LabelColor;
};

export const LOYALTY_CLASSIFICATION: Record<LoyaltyClassification, ClassificationConfig> = {
  FREQUENT: { labelKey: 'clientsModule.loyalty.classification.frequent', color: 'success' },
  NEW: { labelKey: 'clientsModule.loyalty.classification.new', color: 'info' },
};
