import { splitName } from './split-name';

describe('splitName', () => {
  it('splits a full name into firstName and lastName', () => {
    const result = splitName('John Doe');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
  });

  it('returns empty lastName when only one name is provided', () => {
    const result = splitName('John');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('');
  });

  it('joins remaining parts as lastName when more than two names are provided', () => {
    const result = splitName('John A Doe');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('A Doe');
  });

  it('returns empty strings for an empty input', () => {
    const result = splitName('');
    expect(result.firstName).toBe('');
    expect(result.lastName).toBe('');
  });

  it('handles multiple spaces between words', () => {
    const result = splitName('John   Doe');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
  });
});
