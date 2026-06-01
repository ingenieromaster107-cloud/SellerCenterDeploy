import type { LevelPalette } from '../app-reputation-panel';
import type { ReputationLevel } from 'src/interfaces/dashboard/seller-reputation-indicators';

import { render, screen } from '@testing-library/react';

import { HealthScoreBar } from './health-scorebar';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
    currentLang: 'es',
  }),
}));

const palette: LevelPalette = { color: '#11aa11', contrastText: '#fff', soft: '#eee' };
const palettes: Record<ReputationLevel, LevelPalette> = {
  GREEN: palette,
  YELLOW: palette,
  RED: palette,
  INSUFFICIENT_DATA: palette,
};

const renderBar = (level: ReputationLevel) =>
  render(<HealthScoreBar level={level} palettes={palettes} />);

const collectInjectedCss = (): string => {
  let css = '';
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      Array.from(sheet.cssRules).forEach((rule) => {
        css += rule.cssText;
      });
    } catch {
      /* cross-origin or empty sheet — ignore */
    }
  });
  return css.replace(/\s/g, '');
};

describe('HealthScoreBar', () => {
  it('renders the title and the three level labels', () => {
    renderBar('GREEN');
    expect(screen.getByText('reputationModule.healthScore')).toBeInTheDocument();
    expect(screen.getByText('reputationModule.levels.red')).toBeInTheDocument();
    expect(screen.getByText('reputationModule.levels.yellow')).toBeInTheDocument();
    expect(screen.getByText('reputationModule.levels.green')).toBeInTheDocument();
  });

  it.each<[ReputationLevel, string]>([
    ['RED', '25%'],
    ['YELLOW', '55%'],
    ['GREEN', '85%'],
    ['INSUFFICIENT_DATA', '0%'],
  ])('fills %s to %s width', (level, expectedWidth) => {
    const { container } = renderBar(level);
    expect(container.querySelector('.MuiBox-root .MuiBox-root')).toBeInTheDocument();

    const css = collectInjectedCss();
    expect(css).toContain(`width:${expectedWidth}`);
  });
});
