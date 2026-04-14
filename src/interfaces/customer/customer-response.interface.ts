export interface CustomerResponse {
  customer: {
    firstname: string;
    lastname: string;
    email: string;
    identificationNumber: {
      value: string;
    }[];
    identificationType: {
      selected_options: {
        label: string;
        value: string;
      }[];
    }[];
    addresses: {
      id: number;
      firstname: string;
      lastname: string;
      street: string[];
      city: string;
      region: {
        region_id: number;
        region_code: string;
      };
      country_code: string;
      telephone: string;
      postcode: string;
      default_billing: boolean;
      default_shipping: boolean;
    }[];
  };
}
