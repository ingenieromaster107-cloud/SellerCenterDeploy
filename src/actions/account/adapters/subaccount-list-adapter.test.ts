import type { SubAccountResponseInterface } from 'src/interfaces';

import { subaccountListAdapter } from './subaccount-list-adapter';

jest.mock('src/sections/sub-account/constants/status', () => ({
  PERMISSIONS: [
    { value: 'marketplace/product/add', label: 'Create product' },
  ]
}));

const makeSubAccount = (overrides: Partial<SubAccountResponseInterface> = {}): SubAccountResponseInterface => ({
  entity_id: 6,
  name: 'john doe',
  email: 'john@example.com',
  status: 1,
  created_at: '2024-01-01T00:00:00Z',
  permissionType: ['marketplace/product/add'],
  ...overrides,
  customer_id: 123,
  seller_id: 456,
});

describe('subaccountListAdapter', () => {
  it('returns empty array for empty input', () => {
    const result = subaccountListAdapter([]);
    expect(result).toEqual([]);
  });

  it('maps subAccount to correct shape', () => {
    const input = makeSubAccount({
      entity_id: 42,
      name: 'john doe',
      email: 'john@example.com',
      status: 1,
      created_at: '2024-01-01T00:00:00Z',
      permissionType: ['marketplace/product/add'],
    });

    const [result] = subaccountListAdapter([input]);

    expect(result.id).toBe(42);
    expect(result.email).toBe('john@example.com');
    expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(result.permissions).toBeDefined();
  });

  it('capitalizes firstname and lastname', () => {
    const input = makeSubAccount({ name: 'john doe' });
    const [result] = subaccountListAdapter([input]);

    expect(result.firstname).toBe('John');
    expect(result.lastname).toBe('Doe');
  });

  it('sets status to ACTIVE when status is 1', () => {
    const input = makeSubAccount({ status: 1 });
    const [result] = subaccountListAdapter([input]);

    expect(result.status).toBe('ACTIVE');
  });

  it('sets status to INACTIVE when status is not 1', () => {
    const input = makeSubAccount({ status: 0 });
    const [result] = subaccountListAdapter([input]);

    expect(result.status).toBe('INACTIVE');
  });

  it('handles multiple subaccounts correctly', () => {
    const inputs = [
      makeSubAccount({ entity_id: 1, name: 'alice smith', status: 1 }),
      makeSubAccount({ entity_id: 2, name: 'bob jones', status: 0 }),
    ];

    const results = subaccountListAdapter(inputs);

    expect(results).toHaveLength(2);
    expect(results[0].id).toBe(1);
    expect(results[0].firstname).toBe('Alice');
    expect(results[0].status).toBe('ACTIVE');
    expect(results[1].id).toBe(2);
    expect(results[1].firstname).toBe('Bob');
    expect(results[1].status).toBe('INACTIVE');
  });
});
