export interface AttributesResponse {
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
