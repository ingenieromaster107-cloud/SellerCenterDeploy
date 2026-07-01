import { capitalizeFirstLetter } from './capitalize-text';

describe('capitalizeFirstLetter', () => {
  it('capitalizes the first letter of a lowercase string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('lowercases the rest of the string', () => {
    expect(capitalizeFirstLetter('hELLO wORLD')).toBe('Hello world');
  });

  it('handles an empty string', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('handles an all-uppercase string', () => {
    expect(capitalizeFirstLetter('WORLD')).toBe('World');
  });

  it('handles a single character', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });
});
