import { formatPeriod } from './reputation-functions';

describe('formatPeriod', () => {
  it('returns empty string for empty input', () => {
    expect(formatPeriod('')).toBe('');
  });

  it('returns the original string for an invalid date', () => {
    expect(formatPeriod('no-es-fecha')).toBe('no-es-fecha');
  });

  it('formats a valid date that uses a space separator', () => {
    const result = formatPeriod('2024-06-01 10:00:00');
    expect(result).not.toBe('2024-06-01 10:00:00');
    expect(result).not.toBe('');
    expect(result).toContain('2024');
  });

  it('formats a plain ISO date', () => {
    const result = formatPeriod('2024-05-01');
    expect(result).not.toBe('');
    expect(result).toContain('2024');
  });
});
