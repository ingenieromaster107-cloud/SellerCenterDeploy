import { renderHook } from '@testing-library/react';

import { useSimpleProductPayload } from './use-simple-product-payload';

function makeFile(name: string, type = 'image/png'): File {
  return new File(['content'], name, { type });
}

describe('useSimpleProductPayload', () => {
  it('returns buildPayload function', () => {
    const { result } = renderHook(() => useSimpleProductPayload());
    expect(typeof result.current.buildPayload).toBe('function');
  });

  it('buildPayload returns payload with name and sku', async () => {
    const { result } = renderHook(() => useSimpleProductPayload());
    const payload = await result.current.buildPayload(
      {
        name: 'Test Product',
        sku: 'SKU-001',
        categoryId: '10',
        price: 99.99,
        weight: 0.5,
        stock: 5,
        shortDescription: 'Short',
        description: 'Full description',
      },
      []
    );

    expect(payload.name).toBe('Test Product');
    expect(payload.sku).toBe('SKU-001');
    expect(payload.categoryId).toBe('10');
    expect(payload.price).toBe(99.99);
    expect(payload.weight).toBe(0.5);
    expect(payload.stock).toBe(5);
    expect(payload.shortDescription).toBe('Short');
    expect(payload.description).toBe('Full description');
  });

  it('buildPayload returns empty mediaGallery for no images', async () => {
    const { result } = renderHook(() => useSimpleProductPayload());
    const payload = await result.current.buildPayload(
      { name: 'P', sku: 'S', categoryId: '1', price: 10, weight: 1, stock: 1, shortDescription: '', description: '' },
      []
    );
    expect(payload.mediaGallery).toEqual([]);
  });

  it('buildPayload converts images to mediaGallery entries', async () => {
    const { result } = renderHook(() => useSimpleProductPayload());
    const file = makeFile('test-image.png');
    const payload = await result.current.buildPayload(
      { name: 'P', sku: 'SKU', categoryId: '1', price: 10, weight: 1, stock: 1, shortDescription: '', description: '' },
      [{ file }]
    );

    expect(payload.mediaGallery).toHaveLength(1);
    const entry = payload.mediaGallery[0];
    expect(entry.media_type).toBe('image');
    expect(entry.label).toBe('test-image');
    expect(entry.position).toBe(0);
    expect(entry.disabled).toBe(false);
    expect(entry.types).toContain('thumbnail');
  });

  it('first image gets thumbnail types, subsequent images get only image type', async () => {
    const { result } = renderHook(() => useSimpleProductPayload());
    const files = [makeFile('img1.png'), makeFile('img2.png')];
    const payload = await result.current.buildPayload(
      { name: 'P', sku: 'S', categoryId: '1', price: 10, weight: 1, stock: 1, shortDescription: '', description: '' },
      files.map((f) => ({ file: f }))
    );

    expect(payload.mediaGallery[0].types).toEqual(['image', 'small_image', 'thumbnail']);
    expect(payload.mediaGallery[1].types).toEqual(['image']);
  });

  it('defaults to 0 for invalid price/weight/stock', async () => {
    const { result } = renderHook(() => useSimpleProductPayload());
    const payload = await result.current.buildPayload(
      { name: 'P', sku: 'S', categoryId: '1', price: NaN, weight: NaN, stock: NaN, shortDescription: '', description: '' },
      []
    );
    expect(payload.price).toBe(0);
    expect(payload.weight).toBe(0);
    expect(payload.stock).toBe(0);
  });
});
