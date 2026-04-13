import type { IAttributes } from 'src/interfaces/attributes/attributes.interface';
import type { IAttributesResponse } from 'src/interfaces/attributes/attributes-response.interface';

export function AttributesAdapter(data: IAttributesResponse): IAttributes {
  if (!data || !('customAttributeMetadataV2' in data)) {
    console.warn('No found attributes info');
    return {} as IAttributes;
  }

  const firstItem = data.customAttributeMetadataV2.items[0];

  return {
    items: firstItem
  };
}
