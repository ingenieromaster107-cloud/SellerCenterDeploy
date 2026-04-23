import type { Attributes } from 'src/interfaces/attributes/attributes.interface';
import type { AttributesResponse } from 'src/interfaces/attributes/attributes-response.interface';

export function AttributesAdapter(data: AttributesResponse): Attributes {
  if (!data || !('customAttributeMetadataV2' in data)) {
    console.warn('No found attributes info');
    return {} as Attributes;
  }

  const firstItem = data.customAttributeMetadataV2.items[0];

  return {
    items: firstItem
  };
}
