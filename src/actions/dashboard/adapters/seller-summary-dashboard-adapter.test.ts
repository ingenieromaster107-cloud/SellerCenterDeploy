import type {
  SellerSummaryDashboardData,
  SellerSummaryDashboardResponse,
} from 'src/interfaces/dashboard/seller-summary-dashboard';

import { sellerSummaryDashboardAdapter } from './seller-summary-dashboard-adapter';

const VALID_DATA: SellerSummaryDashboardData = {
  sales_account: { total_sales: 10, total_returns: 1 },
  orders_account: {
    created_orders: 2,
    pending_payment_orders: 3,
    pending_return_orders: 4,
    canceled_orders: 5,
    returned_orders: 6,
  },
  products_account: {
    created_products: 7,
    active_products: 8,
    inactive_products: 9,
    pending_approval_products: 10,
    out_of_stock_products: 11,
  },
  logistics_account: {
    pending_shipment_orders: 12,
    shipped_orders: 13,
    delivered_orders: 14,
  },
  reputation_account: { reviews_count: 15, stars_count: 16 },
};

const VALID_RESPONSE: SellerSummaryDashboardResponse = {
  sellerSummaryDashboard: { success: true, message: 'ok', data: VALID_DATA },
};

const EMPTY_DATA_SHAPE = {
  sales_account: { total_sales: 0, total_returns: 0 },
  orders_account: {
    created_orders: 0,
    pending_payment_orders: 0,
    pending_return_orders: 0,
    canceled_orders: 0,
    returned_orders: 0,
  },
  products_account: {
    created_products: 0,
    active_products: 0,
    inactive_products: 0,
    pending_approval_products: 0,
    out_of_stock_products: 0,
  },
  logistics_account: {
    pending_shipment_orders: 0,
    shipped_orders: 0,
    delivered_orders: 0,
  },
  reputation_account: { reviews_count: 0, stars_count: 0 },
};

describe('sellerSummaryDashboardAdapter', () => {
  describe('when input is falsy or sellerSummaryDashboard is absent', () => {
    it('returns empty default when called with no argument', () => {
      const result = sellerSummaryDashboardAdapter();
      expect(result).toMatchObject({ success: false, message: '', data: EMPTY_DATA_SHAPE });
    });

    it('returns empty default when called with null', () => {
       
      const result = sellerSummaryDashboardAdapter(null as any);
      expect(result.success).toBe(false);
      expect(result.data).toMatchObject(EMPTY_DATA_SHAPE);
    });

    it('returns empty default when sellerSummaryDashboard key is absent', () => {
      const result = sellerSummaryDashboardAdapter({} as SellerSummaryDashboardResponse);
      expect(result.success).toBe(false);
      expect(result.message).toBe('');
      expect(result.data).toMatchObject(EMPTY_DATA_SHAPE);
    });
  });

  describe('when input contains a valid payload', () => {
    it('returns success true', () => {
      expect(sellerSummaryDashboardAdapter(VALID_RESPONSE).success).toBe(true);
    });

    it('returns the message from the payload', () => {
      expect(sellerSummaryDashboardAdapter(VALID_RESPONSE).message).toBe('ok');
    });

    it('returns the data object by reference', () => {
      expect(sellerSummaryDashboardAdapter(VALID_RESPONSE).data).toBe(VALID_DATA);
    });

    it('returns correct sales_account values', () => {
      const result = sellerSummaryDashboardAdapter(VALID_RESPONSE);
      expect(result.data?.sales_account.total_sales).toBe(10);
      expect(result.data?.sales_account.total_returns).toBe(1);
    });

    it('returns correct reputation_account values', () => {
      const result = sellerSummaryDashboardAdapter(VALID_RESPONSE);
      expect(result.data?.reputation_account.reviews_count).toBe(15);
      expect(result.data?.reputation_account.stars_count).toBe(16);
    });

    it('propagates success false from the API response', () => {
      const response: SellerSummaryDashboardResponse = {
        sellerSummaryDashboard: { success: false, message: 'error', data: VALID_DATA },
      };
      expect(sellerSummaryDashboardAdapter(response).success).toBe(false);
    });
  });

  describe('when payload exists but data is null', () => {
    it('falls back to EMPTY_SUMMARY_DATA while preserving success and message', () => {
       
      const result = sellerSummaryDashboardAdapter({ sellerSummaryDashboard: { success: true, message: 'ok', data: null } } as any);
      expect(result.success).toBe(true);
      expect(result.message).toBe('ok');
      expect(result.data).toMatchObject(EMPTY_DATA_SHAPE);
    });

    it('returns zero for all numeric fields in the fallback', () => {
       
      const result = sellerSummaryDashboardAdapter({ sellerSummaryDashboard: { success: true, message: 'ok', data: null } } as any);
      expect(result.data?.sales_account.total_sales).toBe(0);
      expect(result.data?.logistics_account.shipped_orders).toBe(0);
      expect(result.data?.reputation_account.stars_count).toBe(0);
    });
  });
});
