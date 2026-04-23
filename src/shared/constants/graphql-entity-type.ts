export const EntityType = {
  Customer: 'customer',
  RmaItem: 'rma_item',
} as const;

export type EntityTypeType =
  typeof EntityType[keyof typeof EntityType];