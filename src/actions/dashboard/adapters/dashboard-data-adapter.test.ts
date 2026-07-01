import type { DashboardData } from 'src/interfaces/dashboard/dashboard';

import { dashboardDataAdapter } from './dashboard-data-adapter';


const VALID_DATA: DashboardData = {
  sellerMetricsDashboard: {
    message: 'OK',
    success: true,
    data: [
      {
        average_order_value: {
          avg_order_value: '100',
          avg_order_value_formatted: '$100',
          graph_data: ['10', '20'],
          graph_x_value: ['Jan', 'Feb'],
        },
        top_sale_products: [],
        top_customers: [],
        total_sales: {
          commission_paid: '5',
          graph_data: [],
          graph_x_value: [],
          remaining_payout: '95',
          total_payout: '100',
          total_sale: '200',
          total_sale_amount: '$200',
        },
        orders_over_time: {
          graph_data: [],
          graph_x_value: [],
        },
      },
    ],
  },
};

describe('dashboardDataAdapter', () => {
  describe('when input is falsy or missing sellerMetricsDashboard', () => {
    it('returns empty default when called with null', () => {
      const result = dashboardDataAdapter(null as unknown as DashboardData);
      expect(result).toEqual({ message: '', success: false, data: [] });
    });

    it('returns empty default when called with undefined', () => {
      const result = dashboardDataAdapter(undefined as unknown as DashboardData);
      expect(result).toEqual({ message: '', success: false, data: [] });
    });

    it('returns empty default when sellerMetricsDashboard is missing', () => {
      const result = dashboardDataAdapter({} as DashboardData);
      expect(result).toEqual({ message: '', success: false, data: [] });
    });

    it('returns empty default when sellerMetricsDashboard is null', () => {
      const result = dashboardDataAdapter({ sellerMetricsDashboard: null as any });
      expect(result).toEqual({ message: '', success: false, data: [] });
    });
  });

  describe('when input contains valid sellerMetricsDashboard', () => {
    it('returns the sellerMetricsDashboard payload directly', () => {
      const result = dashboardDataAdapter(VALID_DATA);
      expect(result).toBe(VALID_DATA.sellerMetricsDashboard);
    });

    it('returns correct message and success flag', () => {
      const result = dashboardDataAdapter(VALID_DATA);
      expect(result.success).toBe(true);
      expect(result.message).toBe('OK');
    });

    it('returns the data array unchanged', () => {
      const result = dashboardDataAdapter(VALID_DATA);
      expect(result.data).toHaveLength(1);
    });
  });
});
