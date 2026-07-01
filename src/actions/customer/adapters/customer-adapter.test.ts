import { CustomerAdapter } from './customer-adapter';

const baseCustomer = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  identificationNumber: [{ value: '123456789' }],
  identificationType: [{ selected_options: [{ label: 'DNI', value: 'dni' }] }],
  addresses: [],
};

describe('CustomerAdapter', () => {
  it('returns {} for null', () => {
    const result = CustomerAdapter(null as any);
    expect(result).toEqual({});
  });

  it("returns {} when 'customer' key is missing", () => {
    const result = CustomerAdapter({} as any);
    expect(result).toEqual({});
  });

  it('maps firstname, lastname, and email correctly', () => {
    const data = { customer: { ...baseCustomer } } as any;
    const result = CustomerAdapter(data);
    expect(result.firstname).toBe('John');
    expect(result.lastname).toBe('Doe');
    expect(result.email).toBe('john.doe@example.com');
  });

  it('extracts identificationNumber value', () => {
    const data = { customer: { ...baseCustomer } } as any;
    const result = CustomerAdapter(data);
    expect(result.identificationNumber).toEqual({ value: '123456789' });
  });

  it('extracts identificationType label and value', () => {
    const data = { customer: { ...baseCustomer } } as any;
    const result = CustomerAdapter(data);
    expect(result.identificationType).toEqual({ label: 'DNI', value: 'dni' });
  });

  it('uses default_shipping address when present', () => {
    const shippingAddress = { id: 1, street: ['Main St'], default_shipping: true };
    const otherAddress = { id: 2, street: ['Second St'], default_shipping: false };
    const data = {
      customer: {
        ...baseCustomer,
        addresses: [otherAddress, shippingAddress],
      },
    } as any;
    const result = CustomerAdapter(data);
    expect(result.address).toEqual(shippingAddress);
  });

  it('falls back to addresses[0] when no default_shipping is set', () => {
    const firstAddress = { id: 1, street: ['First Ave'], default_shipping: false };
    const secondAddress = { id: 2, street: ['Second Ave'], default_shipping: false };
    const data = {
      customer: {
        ...baseCustomer,
        addresses: [firstAddress, secondAddress],
      },
    } as any;
    const result = CustomerAdapter(data);
    expect(result.address).toEqual(firstAddress);
  });
});
