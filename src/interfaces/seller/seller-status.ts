// Estados de vinculación del seller en la plataforma.
// Cualquier estado nuevo debe agregarse aquí Y reflejarse en el backend
// (campo `sellerLinkingStatus` de la query `GetCurrentUser`).

export const SELLER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  APPROVED: 'APPROVED',
  DISAPPROVED: 'DISAPPROVED',
} as const;

export type SellerStatus = (typeof SELLER_STATUS)[keyof typeof SELLER_STATUS];

export const SELLER_STATUS_VALUES: SellerStatus[] = Object.values(SELLER_STATUS);

export const isSellerStatus = (value: unknown): value is SellerStatus =>
  typeof value === 'string' && (SELLER_STATUS_VALUES as string[]).includes(value);
