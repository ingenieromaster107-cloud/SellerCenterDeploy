import { sellerLoyaltyAdapter } from './seller-loyalty-adapter';

const EMPTY_DATA = {
  total_customers: 0,
  new_customers: 0,
  frequent_customers: 0,
  loyalty_rate: 0,
  customers: [],
};

describe('sellerLoyaltyAdapter', () => {
  it('returns empty default for undefined input', () => {
    const result = sellerLoyaltyAdapter();
    expect(result).toEqual({ success: false, message: '', data: EMPTY_DATA });
  });

  it('returns empty default when sellerCustomerLoyalty is missing', () => {
    const result = sellerLoyaltyAdapter({} as any);
    expect(result).toEqual({ success: false, message: '', data: EMPTY_DATA });
  });

  it('returns empty default when payload has no data field', () => {
    const input = {
      sellerCustomerLoyalty: {
        success: false,
        message: 'No data available',
        data: null,
      },
    } as any;

    const result = sellerLoyaltyAdapter(input);

    expect(result).toEqual({ success: false, message: 'No data available', data: EMPTY_DATA });
  });

  it('returns empty default with empty message when message is missing and data is null', () => {
    const input = {
      sellerCustomerLoyalty: {
        success: false,
        data: null,
      },
    } as any;

    const result = sellerLoyaltyAdapter(input);

    expect(result.message).toBe('');
    expect(result.data).toEqual(EMPTY_DATA);
  });

  it('normalizes FRECUENTE to FREQUENT', () => {
    const input = {
      sellerCustomerLoyalty: {
        success: true,
        message: 'ok',
        data: {
          total_customers: 1,
          new_customers: 0,
          frequent_customers: 1,
          loyalty_rate: 100,
          customers: [
            { id: 1, name: 'Ana', classification: 'FRECUENTE' },
          ],
        },
      },
    } as any;

    const result = sellerLoyaltyAdapter(input);

    expect(result.data.customers[0].classification).toBe('FREQUENT');
  });

  it('normalizes frecuente (lower case) to FREQUENT', () => {
    const input = {
      sellerCustomerLoyalty: {
        success: true,
        message: 'ok',
        data: {
          total_customers: 1,
          new_customers: 0,
          frequent_customers: 1,
          loyalty_rate: 100,
          customers: [
            { id: 2, name: 'Bob', classification: 'frecuente' },
          ],
        },
      },
    } as any;

    const result = sellerLoyaltyAdapter(input);

    expect(result.data.customers[0].classification).toBe('FREQUENT');
  });

  it('normalizes FREQUENT correctly', () => {
    const input = {
      sellerCustomerLoyalty: {
        success: true,
        message: 'ok',
        data: {
          total_customers: 1,
          new_customers: 0,
          frequent_customers: 1,
          loyalty_rate: 100,
          customers: [
            { id: 3, name: 'Carol', classification: 'FREQUENT' },
          ],
        },
      },
    } as any;

    const result = sellerLoyaltyAdapter(input);

    expect(result.data.customers[0].classification).toBe('FREQUENT');
  });

  it('normalizes FREQ prefix to FREQUENT', () => {
    const input = {
      sellerCustomerLoyalty: {
        success: true,
        message: 'ok',
        data: {
          total_customers: 1,
          new_customers: 0,
          frequent_customers: 1,
          loyalty_rate: 100,
          customers: [
            { id: 4, name: 'Dave', classification: 'FREQ_BUYER' },
          ],
        },
      },
    } as any;

    const result = sellerLoyaltyAdapter(input);

    expect(result.data.customers[0].classification).toBe('FREQUENT');
  });

  it('normalizes anything else to NEW', () => {
    const input = {
      sellerCustomerLoyalty: {
        success: true,
        message: 'ok',
        data: {
          total_customers: 2,
          new_customers: 2,
          frequent_customers: 0,
          loyalty_rate: 0,
          customers: [
            { id: 5, name: 'Eve', classification: 'NUEVO' },
            { id: 6, name: 'Frank', classification: 'unknown_type' },
          ],
        },
      },
    } as any;

    const result = sellerLoyaltyAdapter(input);

    expect(result.data.customers[0].classification).toBe('NEW');
    expect(result.data.customers[1].classification).toBe('NEW');
  });

  it('preserves other payload fields unchanged', () => {
    const input = {
      sellerCustomerLoyalty: {
        success: true,
        message: 'Success',
        data: {
          total_customers: 3,
          new_customers: 1,
          frequent_customers: 2,
          loyalty_rate: 66.7,
          customers: [
            { id: 7, name: 'Grace', classification: 'FRECUENTE' },
          ],
        },
      },
    } as any;

    const result = sellerLoyaltyAdapter(input);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Success');
    expect(result.data.total_customers).toBe(3);
    expect(result.data.new_customers).toBe(1);
    expect(result.data.frequent_customers).toBe(2);
    expect(result.data.loyalty_rate).toBe(66.7);
  });
});
