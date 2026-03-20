export interface ICustomerGraphQLResponse {
  customer: ICustomer;
}

export interface ICustomer {
  firstname: string;
  lastname: string;
  email: string;
  identificationNumber: NumeroIdentificacion[];
  identificationType: TipoIdentificacion[];
  addresses: Address[];
}

export interface Address {
  id: number;
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  region: Region;
  telephone: string;
  default_billing: boolean;
  default_shipping: boolean;
}

export interface Region {
  region_id: number;
  region_code: string;
}

export interface NumeroIdentificacion {
  code: string;
  value: string;
}

export interface TipoIdentificacion {
  code: string;
}