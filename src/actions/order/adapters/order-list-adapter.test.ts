import type { DataList } from 'src/interfaces/order';

import { adaptOrderListResponse } from './order-list-adapter';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeTotalDetail = () => ({
  grand_total: { value: 250.0 },
  base_grand_total: { value: 250.0 },
  pending_balance: null,
  shipping_handling: {
    amount_excluding_tax: { value: 10.0 },
    amount_including_tax: { value: 11.9 },
    discounts: [],
    taxes: [],
    total_amount: { value: 11.9 },
  },
  subtotal: { value: 238.1 },
  subtotal_excl_tax: { value: 200.0 },
  subtotal_incl_tax: { value: 238.1 },
  total_shipping: { value: 11.9 },
  total_tax: { value: 38.1 },
  total_store_credit: { value: 0 },
});

const makeItem = (overrides = {}) => ({
  product_sku: 'SKU-001',
  product_name: 'Laptop Pro 15',
  quantity_ordered: 2,
  quantity_invoiced: 1,
  product_image: 'https://cdn.example.com/laptop.jpg',
  product_sale_price: { value: 120.0 },
  row_total: 240.0,
  ...overrides,
});

const makeOrder = (overrides = {}) => ({
  order_number: 'ORD-2024-001',
  status: 'processing',
  created_at: '2024-06-10T08:30:00Z',
  order_date: '2024-06-10T08:30:00Z',
  email: 'jane.doe@example.com',
  grand_total: 250.0,
  customer_info: { firstname: 'Jane', lastname: 'Doe' },
  payment_methods: [{ name: 'Credit Card', type: 'card' }],
  total: makeTotalDetail(),
  items: [makeItem()],
  ...overrides,
});

const makeResponse = (items: any[] | null): DataList =>
  ({
    sellerOrders: {
      total_count: items ? items.length : 0,
      user_message: null,
      items: items as any,
      page_info: { current_page: 1, page_size: 20, total_pages: 1 },
    },
  } as DataList);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('adaptOrderListResponse', () => {
  it('returns [] when items is null/undefined', () => {
    const result = adaptOrderListResponse(makeResponse(null));
    expect(result).toEqual([]);
  });

  it('maps order to correct shape with orderNumber, status and createDate', () => {
    const order = makeOrder();
    const result = adaptOrderListResponse(makeResponse([order]));

    expect(result).toHaveLength(1);
    expect(result[0].orderNumber).toBe('ORD-2024-001');
    expect(result[0].status).toBe('processing');
    expect(result[0].createDate).toBe('2024-06-10T08:30:00Z');
  });

  it('concatenates customerName from firstname + lastname', () => {
    const order = makeOrder({
      customer_info: { firstname: 'Carlos', lastname: 'Ramirez' },
    });
    const result = adaptOrderListResponse(makeResponse([order]));

    expect(result[0].customer.name).toBe('Carlos Ramirez');
    expect(result[0].customer.email).toBe(order.email);
  });

  it('calculates totalQuantity as the sum of quantity_ordered across all items', () => {
    const order = makeOrder({
      items: [
        makeItem({ product_sku: 'SKU-001', quantity_ordered: 3 }),
        makeItem({ product_sku: 'SKU-002', quantity_ordered: 5 }),
        makeItem({ product_sku: 'SKU-003', quantity_ordered: 2 }),
      ],
    });
    const result = adaptOrderListResponse(makeResponse([order]));

    expect(result[0].totalQuantity).toBe(10);
  });

  it('treats missing quantity_ordered as 0 when summing totalQuantity', () => {
    const order = makeOrder({
      items: [
        makeItem({ product_sku: 'SKU-A', quantity_ordered: 4 }),
        makeItem({ product_sku: 'SKU-B', quantity_ordered: undefined }),
      ],
    });
    const result = adaptOrderListResponse(makeResponse([order]));

    expect(result[0].totalQuantity).toBe(4);
  });

  it('maps items to the correct shape', () => {
    const rawItem = makeItem({
      product_sku: 'SKU-XYZ',
      product_name: 'Wireless Mouse',
      quantity_ordered: 1,
      product_image: 'https://cdn.example.com/mouse.jpg',
      product_sale_price: { value: 29.99 },
    });
    const order = makeOrder({ items: [rawItem] });
    const result = adaptOrderListResponse(makeResponse([order]));

    const mappedItem = result[0].items[0];
    expect(mappedItem.id).toBe('SKU-XYZ');
    expect(mappedItem.sku).toBe('SKU-XYZ');
    expect(mappedItem.name).toBe('Wireless Mouse');
    expect(mappedItem.quantity).toBe(1);
    expect(mappedItem.priceDropshipper).toBe(29.99);
    expect(mappedItem.priceProvider).toBe(29.99);
    expect(mappedItem.coverUrl).toBe('https://cdn.example.com/mouse.jpg');
  });

  it('uses array index as item id when product_sku is falsy', () => {
    const rawItem = makeItem({ product_sku: '' });
    const order = makeOrder({ items: [rawItem] });
    const result = adaptOrderListResponse(makeResponse([order]));

    expect(result[0].items[0].id).toBe(0);
  });

  it('maps prices from order.total to the prices field', () => {
    const order = makeOrder();
    const result = adaptOrderListResponse(makeResponse([order]));
    const { prices } = result[0];

    expect(prices.grand_total).toEqual({ value: 250.0 });
    expect(prices.base_grand_total).toEqual({ value: 250.0 });
    expect(prices.subtotal).toEqual({ value: 238.1 });
    expect(prices.total_tax).toEqual({ value: 38.1 });
    expect(prices.pending_balance).toBeNull();
  });

  it('maps product field from the first item', () => {
    const firstItem = makeItem({
      product_name: 'Mechanical Keyboard',
      quantity_ordered: 2,
      quantity_invoiced: 1,
    });
    const order = makeOrder({ items: [firstItem] });
    const result = adaptOrderListResponse(makeResponse([order]));

    expect(result[0].product).toEqual({
      name: 'Mechanical Keyboard',
      quantityOrdered: 2,
      quantityInvoiced: 1,
    });
  });

  it('returns empty strings/zeros for product when items array is empty', () => {
    const order = makeOrder({ items: [] });
    const result = adaptOrderListResponse(makeResponse([order]));

    expect(result[0].product).toEqual({
      name: '',
      quantityOrdered: 0,
      quantityInvoiced: 0,
    });
    expect(result[0].totalQuantity).toBe(0);
  });

  it('picks paymentMethodSelected from the first payment method name', () => {
    const order = makeOrder({
      payment_methods: [{ name: 'PayPal', type: 'digital' }],
    });
    const result = adaptOrderListResponse(makeResponse([order]));

    expect(result[0].paymentMethodSelected).toBe('PayPal');
  });

  it('returns empty string for paymentMethodSelected when payment_methods is empty', () => {
    const order = makeOrder({ payment_methods: [] });
    const result = adaptOrderListResponse(makeResponse([order]));

    expect(result[0].paymentMethodSelected).toBe('');
  });

  it('handles multiple orders and maps each independently', () => {
    const orders = [
      makeOrder({ order_number: 'ORD-001', email: 'alice@example.com' }),
      makeOrder({ order_number: 'ORD-002', email: 'bob@example.com' }),
    ];
    const result = adaptOrderListResponse(makeResponse(orders));

    expect(result).toHaveLength(2);
    expect(result[0].orderNumber).toBe('ORD-001');
    expect(result[1].orderNumber).toBe('ORD-002');
    expect(result[0].customer.email).toBe('alice@example.com');
    expect(result[1].customer.email).toBe('bob@example.com');
  });
});
