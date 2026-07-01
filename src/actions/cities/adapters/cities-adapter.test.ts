import { CitiesAdapter } from './cities-adapter';

describe('CitiesAdapter', () => {
  it('returns the items array when data is valid', () => {
    const mockCities = [
      { id: '1', name: 'Medellin' },
      { id: '2', name: 'Bogota' },
    ];

    const result = CitiesAdapter({
      regionCities: { items: mockCities },
    } as any);

    expect(result).toEqual(mockCities);
  });

  it('returns [] when data is null', () => {
    const result = CitiesAdapter(null as any);

    expect(result).toEqual([]);
  });

  it('returns [] when data does not contain the "regionCities" key', () => {
    const result = CitiesAdapter({} as any);

    expect(result).toEqual([]);
  });
});
