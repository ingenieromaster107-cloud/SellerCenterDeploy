import { KPI_METRICS } from './constants';

describe('dashboard/constants', () => {
  describe('KPI_METRICS', () => {
    it('has 6 metrics defined', () => {
      expect(KPI_METRICS).toHaveLength(6);
    });

    it('includes gross_sales metric', () => {
      const metric = KPI_METRICS.find((m) => m.key === 'gross_sales');
      expect(metric).toBeDefined();
      expect(metric?.format).toBe('currency');
      expect(metric?.additive).toBe(true);
    });

    it('includes units_sold metric', () => {
      const metric = KPI_METRICS.find((m) => m.key === 'units_sold');
      expect(metric).toBeDefined();
      expect(metric?.format).toBe('number');
      expect(metric?.additive).toBe(true);
    });

    it('includes average_price metric as non-additive', () => {
      const metric = KPI_METRICS.find((m) => m.key === 'average_price');
      expect(metric).toBeDefined();
      expect(metric?.format).toBe('currency');
      expect(metric?.additive).toBe(false);
    });

    it('includes visits metric', () => {
      const metric = KPI_METRICS.find((m) => m.key === 'visits');
      expect(metric).toBeDefined();
      expect(metric?.format).toBe('number');
      expect(metric?.additive).toBe(true);
    });

    it('includes conversion metric as percent', () => {
      const metric = KPI_METRICS.find((m) => m.key === 'conversion');
      expect(metric).toBeDefined();
      expect(metric?.format).toBe('percent');
      expect(metric?.additive).toBe(false);
    });

    it('includes cancellation_rate metric as percent', () => {
      const metric = KPI_METRICS.find((m) => m.key === 'cancellation_rate');
      expect(metric).toBeDefined();
      expect(metric?.format).toBe('percent');
      expect(metric?.additive).toBe(false);
    });

    it('every metric has a non-empty titleKey', () => {
      KPI_METRICS.forEach((metric) => {
        expect(typeof metric.titleKey).toBe('string');
        expect(metric.titleKey.length).toBeGreaterThan(0);
      });
    });
  });
});
