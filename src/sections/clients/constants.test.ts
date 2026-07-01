import { LOYALTY_CLASSIFICATION } from './constants';

describe('clients/constants', () => {
  describe('LOYALTY_CLASSIFICATION', () => {
    it('has FREQUENT classification with success color', () => {
      expect(LOYALTY_CLASSIFICATION.FREQUENT).toEqual({
        labelKey: 'clientsModule.loyalty.classification.frequent',
        color: 'success',
      });
    });

    it('has NEW classification with info color', () => {
      expect(LOYALTY_CLASSIFICATION.NEW).toEqual({
        labelKey: 'clientsModule.loyalty.classification.new',
        color: 'info',
      });
    });

    it('has exactly 2 classifications', () => {
      expect(Object.keys(LOYALTY_CLASSIFICATION)).toHaveLength(2);
    });

    it('FREQUENT has a valid labelKey', () => {
      expect(typeof LOYALTY_CLASSIFICATION.FREQUENT.labelKey).toBe('string');
      expect(LOYALTY_CLASSIFICATION.FREQUENT.labelKey.length).toBeGreaterThan(0);
    });
  });
});
