import type { SellerPromotionStatus } from 'src/interfaces/promotions';

export type StatusColorKey =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'primary'
  | 'secondary';

export const PROMOTION_STATUS_COLORS: Record<SellerPromotionStatus, StatusColorKey> = {
  PENDING_APPROVAL: 'warning',
  ACTIVE: 'success',
  PAUSED: 'default',
  EXPIRED: 'error',
  EXHAUSTED: 'info',
};
