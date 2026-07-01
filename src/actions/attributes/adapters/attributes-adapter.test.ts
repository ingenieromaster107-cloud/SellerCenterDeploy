import { AttributesAdapter } from './attributes-adapter';

describe('AttributesAdapter', () => {
  it('returns the first item when data is valid', () => {
    const firstItem = { code: 'color', label: 'Color' } as any;
    const data = {
      customAttributeMetadataV2: {
        items: [firstItem]
      }
    } as any;

    const result = AttributesAdapter(data);

    expect(result).toEqual({ items: firstItem });
  });

  it('returns {} when data is null', () => {
    const result = AttributesAdapter(null as any);

    expect(result).toEqual({});
  });

  it('returns {} when customAttributeMetadataV2 key is missing', () => {
    const data = { otherKey: 'value' } as any;

    const result = AttributesAdapter(data);

    expect(result).toEqual({});
  });
});
