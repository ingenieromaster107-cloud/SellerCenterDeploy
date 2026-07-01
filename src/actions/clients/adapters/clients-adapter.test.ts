import { clientsAdapter } from './clients-adapter';

describe('clientsAdapter', () => {
  it('returns sellerCustomers when present in data', () => {
    const sellerCustomers = {
      message: 'OK',
      success: true,
      total_count: 2,
      data: [{ id: 1 }, { id: 2 }]
    } as any;
    const data = { sellerCustomers } as any;

    const result = clientsAdapter(data);

    expect(result).toEqual(sellerCustomers);
  });

  it('returns default object when data is undefined', () => {
    const result = clientsAdapter(undefined);

    expect(result).toEqual({ message: '', success: false, total_count: 0, data: [] });
  });

  it('returns default object when sellerCustomers is null', () => {
    const data = { sellerCustomers: null } as any;

    const result = clientsAdapter(data);

    expect(result).toEqual({ message: '', success: false, total_count: 0, data: [] });
  });
});
