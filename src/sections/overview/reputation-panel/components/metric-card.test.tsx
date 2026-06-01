import type { MetricItem, LevelPalette } from '../app-reputation-panel';
import type { ReputationLevel } from 'src/interfaces/dashboard/seller-reputation-indicators';

import { render, screen } from '@testing-library/react';

import { MetricCard } from './metric-card';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
    currentLang: 'es',
  }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children, color }: any) => (
    <span data-testid="label" data-color={color}>
      {children}
    </span>
  ),
}));

const palette: LevelPalette = { color: '#000', contrastText: '#fff', soft: '#eee' };
const palettes: Record<ReputationLevel, LevelPalette> = {
  GREEN: palette,
  YELLOW: palette,
  RED: palette,
  INSUFFICIENT_DATA: palette,
};

const makeMetric = (partial: Partial<MetricItem> = {}): MetricItem => ({
  key: 'cancellation',
  title: 'Cancelaciones',
  rate: 5,
  level: 'GREEN',
  suggestion: null,
  unit: 'percent',
  ...partial,
});

const renderCard = (metric: MetricItem) =>
  render(<MetricCard metric={metric} palettes={palettes} />);

describe('MetricCard', () => {
  describe('rate formatting', () => {
    it('shows em dash when rate is null', () => {
      renderCard(makeMetric({ rate: null, level: null }));
      expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('formats an integer percent without decimals', () => {
      renderCard(makeMetric({ rate: 90, unit: 'percent' }));
      expect(screen.getByText('90%')).toBeInTheDocument();
    });

    it('formats a decimal percent with two decimals', () => {
      renderCard(makeMetric({ rate: 4.5, unit: 'percent' }));
      expect(screen.getByText('4.50%')).toBeInTheDocument();
    });

    it('formats decimal hours with unit suffix', () => {
      renderCard(makeMetric({ rate: 4.5, unit: 'hours' }));
      expect(screen.getByText('4.50 h')).toBeInTheDocument();
    });

    it('formats integer hours with unit suffix', () => {
      renderCard(makeMetric({ rate: 5, unit: 'hours' }));
      expect(screen.getByText('5 h')).toBeInTheDocument();
    });
  });

  describe('footer states', () => {
    it('renders the no-data footer when level is null', () => {
      renderCard(makeMetric({ rate: null, level: null }));
      expect(screen.getByText('reputationModule.noData')).toBeInTheDocument();
    });

    it('renders the suggestion text when a suggestion exists', () => {
      renderCard(makeMetric({ level: 'RED', suggestion: 'Mejora tus tiempos' }));
      expect(screen.getByText('Mejora tus tiempos')).toBeInTheDocument();
    });

    it('renders the all-good footer when level set and no suggestion', () => {
      renderCard(makeMetric({ level: 'GREEN', suggestion: null }));
      expect(screen.getByText('reputationModule.allGood')).toBeInTheDocument();
      expect(screen.getByTestId('icon-solar:check-circle-bold')).toBeInTheDocument();
    });
  });

  describe('level chip color', () => {
    it('maps GREEN to success', () => {
      renderCard(makeMetric({ level: 'GREEN' }));
      expect(screen.getByTestId('label')).toHaveAttribute('data-color', 'success');
    });

    it('maps RED to error', () => {
      renderCard(makeMetric({ level: 'RED' }));
      expect(screen.getByTestId('label')).toHaveAttribute('data-color', 'error');
    });

    it('maps null level (INSUFFICIENT_DATA) to default', () => {
      renderCard(makeMetric({ level: null, rate: null }));
      expect(screen.getByTestId('label')).toHaveAttribute('data-color', 'default');
    });
  });
});
