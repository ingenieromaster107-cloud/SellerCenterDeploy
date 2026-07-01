import { PROMOTION_STATUS_COLORS } from './constants';

describe('promotions/resources/constants', () => {
  describe('PROMOTION_STATUS_COLORS', () => {
    it('maps ACTIVE to success', () => {
      expect(PROMOTION_STATUS_COLORS.ACTIVE).toBe('success');
    });

    it('maps PAUSED to default', () => {
      expect(PROMOTION_STATUS_COLORS.PAUSED).toBe('default');
    });

    it('maps PENDING_APPROVAL to warning', () => {
      expect(PROMOTION_STATUS_COLORS.PENDING_APPROVAL).toBe('warning');
    });

    it('maps EXPIRED to error', () => {
      expect(PROMOTION_STATUS_COLORS.EXPIRED).toBe('error');
    });

    it('maps EXHAUSTED to info', () => {
      expect(PROMOTION_STATUS_COLORS.EXHAUSTED).toBe('info');
    });

    it('has exactly 5 status mappings', () => {
      expect(Object.keys(PROMOTION_STATUS_COLORS)).toHaveLength(5);
    });
  });
});
