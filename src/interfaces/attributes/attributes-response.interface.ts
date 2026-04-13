export interface IAttributesResponse {
  customAttributeMetadataV2: {
    items: {
      code: string;
      label: string;
      options: {
        value: string;
        label: string;
      }[];
    }[];
  };
}
