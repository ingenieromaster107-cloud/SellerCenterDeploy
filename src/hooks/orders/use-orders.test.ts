import { renderHook } from '@testing-library/react';

import { useOrders } from './use-orders';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

describe('useOrders', () => {
  it('returns TABLE_ORDER_HEAD array', () => {
    const { result } = renderHook(() => useOrders());
    expect(Array.isArray(result.current.TABLE_ORDER_HEAD)).toBe(true);
  });

  it('TABLE_ORDER_HEAD has 7 items', () => {
    const { result } = renderHook(() => useOrders());
    expect(result.current.TABLE_ORDER_HEAD).toHaveLength(7);
  });

  it('first item has id="orderNumber"', () => {
    const { result } = renderHook(() => useOrders());
    expect(result.current.TABLE_ORDER_HEAD[0].id).toBe('orderNumber');
  });

  it('named items have label field', () => {
    const { result } = renderHook(() => useOrders());
    const namedItems = result.current.TABLE_ORDER_HEAD.filter((item) => item.id !== '');
    namedItems.forEach((item) => {
      expect(item).toHaveProperty('label');
    });
  });
});
