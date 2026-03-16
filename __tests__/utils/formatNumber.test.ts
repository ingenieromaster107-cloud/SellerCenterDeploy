import { fNumber, fCurrency, fPercent, fShortenNumber, fData } from 'src/utils/format-number';
//cases for format number
describe('fNumber', () => {
  it('should format numbers correctly', () => {
    expect(fNumber(1000)).toBe('1,000');
    expect(fNumber(1234567.89)).toBe('1,234,567.89');
  });
  it('should return an empty string for null or undefined', () => {
    expect(fNumber(null)).toBe('');
    expect(fNumber(undefined)).toBe('');
  });
  it('should return an empty string for non-numeric values', () => {
    expect(fNumber('abc')).toBe('');
    expect(fNumber(NaN)).toBe('');
  });
});
//cases for format currency
describe('fCurrency', () => {
  it('should format numbers as currency', () => {
    expect(fCurrency(1000)).toBe('$1,000');
    expect(fCurrency(1234567.89)).toBe('$1,234,567.89');
  });
  it('should return an empty string for null or undefined', () => {
    expect(fCurrency(null)).toBe('');
    expect(fCurrency(undefined)).toBe('');
  });
  it('should return an empty string for non-numeric values', () => {
    expect(fCurrency('abc')).toBe('');
    expect(fCurrency(NaN)).toBe('');
  });
});
//cases for format percent
describe('fPercent', () => {
  it('should format numbers as percent', () => {
    expect(fPercent(0.1)).toBe('10%');
    expect(fPercent(0.1234)).toBe('12.34%');
  });
  it('should return an empty string for null or undefined', () => {
    expect(fPercent(null)).toBe('');
    expect(fPercent(undefined)).toBe('');
  });
  it('should return an empty string for non-numeric values', () => {
    expect(fPercent('abc')).toBe('');
    expect(fPercent(NaN)).toBe('');
  });
});

// cases for format by shorten number

describe('fShortenNumber', () => {
  it('should shorten numbers correctly', () => {
    expect(fShortenNumber(1000)).toBe('1K');
    expect(fShortenNumber(1500)).toBe('1.5K');
    expect(fShortenNumber(1000000)).toBe('1M');
    expect(fShortenNumber(2500000)).toBe('2.5M');
  });
  it('should return an empty string for null or undefined', () => {
    expect(fShortenNumber(null)).toBe('');
    expect(fShortenNumber(undefined)).toBe('');
  });
  it('should return an empty string for non-numeric values', () => {
    expect(fShortenNumber('abc')).toBe('');
    expect(fShortenNumber(NaN)).toBe('');
  });
});

// cases for format by data size
describe('fData', () => {
  it('should format bytes correctly', () => {
    expect(fData(1024)).toBe('1 KB');
  });
  it('should return an empty string for null or undefined', () => {
    expect(fData(null)).toBe('');
    expect(fData(undefined)).toBe('');
  });
  it('should return an empty string for non-numeric values', () => {
    expect(fData('abc')).toBe('');
    expect(fData(NaN)).toBe('');
  });
});
