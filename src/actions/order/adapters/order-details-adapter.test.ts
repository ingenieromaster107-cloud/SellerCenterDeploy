import { orderDetailsAdapter } from './order-details-adapter';

const makeAddress = (overrides: any = {}) => ({
  city: 'Bogotá',
  firstname: 'John',
  lastname: 'Doe',
  postcode: '110111',
  prefix: '',
  region: 'Bogotá D.C.',
  street: ['Main St 123'],
  suffix: '',
  telephone: '1234567890',
  ...overrides,
});

const makeOrder = (overrides: any = {}) => ({
  order_number: 'ORD-001',
  status: 'processing',
  created_at: '2026-01-15',
  customer_info: { firstname: 'John', lastname: 'Doe' },
  email: 'john@test.com',
  payment_methods: [{ name: 'Credit Card' }],
  billing_address: makeAddress(),
  shipping_address: makeAddress({ telephone: '9876543210' }),
  shipping_method: 'flatrate_flatrate',
  shippingDate: '2026-01-16',
  order_track_number: ['TRACK-123'],
  items: [
    {
      product_sku: 'SKU-001',
      product_name: 'Product A',
      quantity_ordered: 2,
      quantity_invoiced: 1,
      product_sale_price: { value: 50 },
      product_image: 'https://cdn.example.com/img.jpg',
      selected_options: [],
    },
  ],
  total: {
    base_grand_total: { value: 100 },
    grand_total: { value: 100 },
    pending_balance: null,
    shipping_handling: { value: 5 },
    subtotal: { value: 95 },
    subtotal_excl_tax: { value: 95 },
    subtotal_incl_tax: { value: 100 },
    total_shipping: { value: 5 },
    total_tax: null,
    total_store_credit: { value: 0 },
  },
  ...overrides,
});

const makeResponse = (orderOverrides: any = {}): any => ({
  sellerOrders: { items: [makeOrder(orderOverrides)] },
});

describe('orderDetailsAdapter', () => {
  it('maps order number', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.orderNumber).toBe('ORD-001');
  });

  it('maps order status', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.status).toBe('processing');
  });

  it('maps createDate', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.createDate).toBe('2026-01-15');
  });

  it('builds full customerName from firstname + lastname', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.customer.name).toBe('John Doe');
  });

  it('maps customer email', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.customer.email).toBe('john@test.com');
  });

  it('calculates totalQuantity as sum of quantity_ordered', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.totalQuantity).toBe(2);
  });

  it('maps payment method name', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.paymentMethodSelected).toBe('Credit Card');
  });

  it('maps billing address fields', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.billing_address.city).toBe('Bogotá');
    expect(result.billing_address.firstname).toBe('John');
  });

  it('maps items with sku and name', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.items).toHaveLength(1);
    expect(result.items[0].sku).toBe('SKU-001');
    expect(result.items[0].name).toBe('Product A');
  });

  it('maps tracking numbers', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.tracking).toEqual(['TRACK-123']);
  });

  it('maps price fields', () => {
    const result = orderDetailsAdapter(makeResponse());
    expect(result.prices.base_grand_total).toEqual({ value: 100 });
  });
});
