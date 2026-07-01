import { CountriesAdapter } from './countries-adapter';

describe('CountriesAdapter', () => {
  it('returns the countries array when data is valid', () => {
    const mockCountries = [
      { id: '1', full_name_english: 'Colombia', two_letter_abbreviation: 'CO' },
      { id: '2', full_name_english: 'Peru', two_letter_abbreviation: 'PE' },
    ];

    const result = CountriesAdapter({ countries: mockCountries } as any);

    expect(result).toEqual(mockCountries);
  });

  it('returns [] when data is null', () => {
    const result = CountriesAdapter(null as any);

    expect(result).toEqual([]);
  });

  it('returns [] when data does not contain the "countries" key', () => {
    const result = CountriesAdapter({} as any);

    expect(result).toEqual([]);
  });
});
