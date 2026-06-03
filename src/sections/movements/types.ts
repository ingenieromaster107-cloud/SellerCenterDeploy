import type { MovementCategory } from './constants';

export type { MovementCategory };

export type Movement = {
  movement_id: string;
  order_id: number;
  order_increment_id: string;
  order_item_id: number;
  seller_id: number;
  category: MovementCategory;
  amount: number;
  commission_value: number;
  net_value: number;
  product_name: string | null;
  quantity: number;
  guide_number: string | null;
  order_status: string | null;
  created_at: string;
};

export type MovementsSummary = {
  seller_id: number;
  date_from: string;
  date_to: string;
  gross_sales: number;
  total_commissions: number;
  total_refunds: number;
  net_seller: number;
  movements_count: number;
};

export type MovementsListResponse = {
  items: Movement[];
  total_count: number;
  search_criteria: unknown;
};

export type MovementsFilters = {
  dateFrom: string;
  dateTo: string;
  categories: MovementCategory[];
};

export type MovementsPagination = {
  page: number;
  pageSize: number;
};
