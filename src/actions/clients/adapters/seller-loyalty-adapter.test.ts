import { sellerLoyaltyAdapter } from './seller-loyalty-adapter';

describe('sellerLoyaltyAdapter', () => {
  it('returns empty loyalty payload when source data is undefined', () => {
    const result = sellerLoyaltyAdapter();

    expect(result).toEqual({
      success: false,
      message: '',
      data: {
        total_customers: 0,
        new_customers: 0,
        frequent_customers: 0,
        loyalty_rate: 0,
        customers: [],
      },
    });
  });

  it('normalizes the backend classification string to a stable key', () => {
    const source = {
      sellerCustomerLoyalty: {
        success: true,
        message: 'ok',
        data: {
          total_customers: 2,
          new_customers: 1,
          frequent_customers: 1,
          loyalty_rate: 50,
          customers: [
            { full_name: 'Ana', email: 'ana@mail.com', orders_count: 4, classification: 'Frecuente' },
            { full_name: 'Beto', email: 'beto@mail.com', orders_count: 1, classification: 'Nuevo' },
          ],
        },
      },
    };

    const result = sellerLoyaltyAdapter(source as any);

    expect(result.data.customers[0].classification).toBe('FREQUENT');
    expect(result.data.customers[1].classification).toBe('NEW');
    expect(result.data.loyalty_rate).toBe(50);
  });
});
