/** Max days between date_from and date_to (mirrors the backend limit). */
export const MAX_RANGE_DAYS = 366;

/** Backend CSV export row cap; above this the file is not returned. */
export const EXPORT_MAX_ROWS = 5000;

/** Movement categories as defined by the Magento backend enum. */
export const MOVEMENT_CATEGORY = {
  SALE: 'VENTA',
  COMMISSION: 'COMISION',
  REFUND: 'DEVOLUCION',
} as const;

export type MovementCategory = (typeof MOVEMENT_CATEGORY)[keyof typeof MOVEMENT_CATEGORY];

/** Label/palette color used to represent each category in the UI. */
export const MOVEMENT_CATEGORY_COLOR: Record<MovementCategory, 'success' | 'warning' | 'error'> = {
  [MOVEMENT_CATEGORY.SALE]: 'success',
  [MOVEMENT_CATEGORY.COMMISSION]: 'warning',
  [MOVEMENT_CATEGORY.REFUND]: 'error',
};
