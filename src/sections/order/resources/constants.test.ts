import { STATUS_COLORS, TABLE_ORDER_HEAD, STATUS_WITHOUT_GUIDES } from './constants';

describe('order/resources/constants', () => {
  describe('STATUS_COLORS', () => {
    it('maps warning statuses correctly', () => {
      expect(STATUS_COLORS['Pago por confirmar']).toBe('warning');
      expect(STATUS_COLORS['Orden en Proceso']).toBe('warning');
      expect(STATUS_COLORS['Entrega Parcial']).toBe('warning');
    });

    it('maps success statuses correctly', () => {
      expect(STATUS_COLORS['Orden Confirmada']).toBe('success');
      expect(STATUS_COLORS['Entregado']).toBe('success');
      expect(STATUS_COLORS['Completo']).toBe('success');
    });

    it('maps error statuses correctly', () => {
      expect(STATUS_COLORS['Cancelado']).toBe('error');
      expect(STATUS_COLORS['Devuelto']).toBe('error');
    });

    it('has exactly 8 entries', () => {
      expect(Object.keys(STATUS_COLORS)).toHaveLength(8);
    });
  });

  describe('TABLE_ORDER_HEAD', () => {
    it('has the expected number of columns', () => {
      expect(TABLE_ORDER_HEAD).toHaveLength(7);
    });

    it('includes orderNumber column', () => {
      const col = TABLE_ORDER_HEAD.find((c) => c.id === 'orderNumber');
      expect(col).toBeDefined();
      expect(col?.label).toBe('Orden');
    });

    it('includes status column', () => {
      const col = TABLE_ORDER_HEAD.find((c) => c.id === 'status');
      expect(col).toBeDefined();
      expect(col?.label).toBe('Estado');
    });

    it('includes amount column', () => {
      const col = TABLE_ORDER_HEAD.find((c) => c.id === 'totalAmount');
      expect(col).toBeDefined();
      expect(col?.label).toBe('Total');
    });
  });

  describe('STATUS_WITHOUT_GUIDES', () => {
    it('contains Pago por confirmar', () => {
      expect(STATUS_WITHOUT_GUIDES).toContain('Pago por confirmar');
    });

    it('contains Cancelado', () => {
      expect(STATUS_WITHOUT_GUIDES).toContain('Cancelado');
    });

    it('has exactly 2 statuses', () => {
      expect(STATUS_WITHOUT_GUIDES).toHaveLength(2);
    });
  });
});
