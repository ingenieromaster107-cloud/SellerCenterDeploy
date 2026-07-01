import { RegionAdapter } from './regions-adapter';

describe('RegionAdapter', () => {
  it('returns the available_regions array when data is valid', () => {
    const mockRegions = [
      { id: '1', name: 'Antioquia', code: 'ANT' },
      { id: '2', name: 'Cundinamarca', code: 'CUN' },
    ];

    const result = RegionAdapter({
      country: { available_regions: mockRegions },
    } as any);

    expect(result).toEqual(mockRegions);
  });

  it('returns [] when data is null', () => {
    const result = RegionAdapter(null as any);

    expect(result).toEqual([]);
  });

  it('returns [] when data does not contain the "country" key', () => {
    const result = RegionAdapter({} as any);

    expect(result).toEqual([]);
  });
});
