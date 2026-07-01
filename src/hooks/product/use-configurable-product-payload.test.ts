import { renderHook } from '@testing-library/react';

import { useConfigurableProductPayload } from './use-configurable-product-payload';

function makeFile(name: string, type = 'image/png'): File {
  return new File(['content'], name, { type });
}

const formData = {
  name: 'Config Product',
  sku: 'CFG-001',
  categoryId: '15',
  price: 149.99,
  weight: 1.5,
  shortDescription: 'Short',
  description: 'Full description',
};

const selectedAttributes = [
  {
    attribute: { attribute_id: 100, code: 'color', label: 'Color', frontend_input: 'select', options: [] },
    selectedValues: ['10', '20'],
  },
];

describe('useConfigurableProductPayload', () => {
  it('returns buildPayload function', () => {
    const { result } = renderHook(() => useConfigurableProductPayload());
    expect(typeof result.current.buildPayload).toBe('function');
  });

  it('buildPayload returns simpleProducts and configurableProduct', async () => {
    const { result } = renderHook(() => useConfigurableProductPayload());
    const children = [
      {
        name: 'Config Product - Red',
        sku: 'CFG-001-RED',
        price: 149.99,
        stock: 10,
        attributes: { color: '10' },
        files: [],
        images: [],
      },
    ];

    const payload = await result.current.buildPayload(formData, [], children, selectedAttributes, 4);
    expect(payload).toHaveProperty('simpleProducts');
    expect(payload).toHaveProperty('configurableProduct');
  });

  it('configurableProduct has correct name and sku', async () => {
    const { result } = renderHook(() => useConfigurableProductPayload());
    const payload = await result.current.buildPayload(formData, [], [], [], 4);
    expect(payload.configurableProduct.name).toBe('Config Product');
    expect(payload.configurableProduct.sku).toBe('CFG-001');
    expect(payload.configurableProduct.type_id).toBe('configurable');
  });

  it('configurableProduct has category link', async () => {
    const { result } = renderHook(() => useConfigurableProductPayload());
    const payload = await result.current.buildPayload(formData, [], [], [], 4);
    const categoryLinks = payload.configurableProduct.extension_attributes.category_links;
    expect(categoryLinks[0].category_id).toBe('15');
  });

  it('simpleProducts maps children correctly', async () => {
    const { result } = renderHook(() => useConfigurableProductPayload());
    const children = [
      { name: 'Variant A', sku: 'SKU-A', price: 100, stock: 5, attributes: { color: '10' }, files: [], images: [] },
      { name: 'Variant B', sku: 'SKU-B', price: 120, stock: 3, attributes: { color: '20' }, files: [], images: [] },
    ];

    const payload = await result.current.buildPayload(formData, [], children, selectedAttributes, 4);
    expect(payload.simpleProducts).toHaveLength(2);
    expect(payload.simpleProducts[0].sku).toBe('SKU-A');
    expect(payload.simpleProducts[1].sku).toBe('SKU-B');
  });

  it('builds configurableOptions from selectedAttributes', async () => {
    const { result } = renderHook(() => useConfigurableProductPayload());
    const payload = await result.current.buildPayload(formData, [], [], selectedAttributes, 4);
    const options = payload.configurableProduct.extension_attributes.configurable_product_options;
    expect(options).toHaveLength(1);
    expect(options[0].attribute_id).toBe(100);
    expect(options[0].label).toBe('Color');
    expect(options[0].values).toHaveLength(2);
  });

  it('converts parent images to media gallery entries', async () => {
    const { result } = renderHook(() => useConfigurableProductPayload());
    const file = makeFile('parent-img.png');
    const payload = await result.current.buildPayload(formData, [{ file }], [], [], 4);
    expect(payload.configurableProduct.media_gallery_entries).toHaveLength(1);
  });

  it('child without files inherits parent media gallery', async () => {
    const { result } = renderHook(() => useConfigurableProductPayload());
    const file = makeFile('parent-img.png');
    const children = [
      { name: 'Variant', sku: 'V', price: 10, stock: 1, attributes: {}, files: [], images: [] },
    ];
    const payload = await result.current.buildPayload(formData, [{ file }], children, [], 4);
    expect(payload.simpleProducts[0].media_gallery_entries).toHaveLength(1);
  });
});
