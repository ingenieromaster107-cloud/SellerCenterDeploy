import type { SellerStatus } from 'src/interfaces/seller/seller-status';

export interface Customer {
  firstname: string;
  lastname: string;
  email: string;
  /**
   * Estado de vinculación del seller. Opcional porque el backend lo está
   * incorporando a `GetCurrentUser`; mientras tanto el frontend asume
   * `PENDING` como default a través de `useSellerStatus`.
   */
  sellerLinkingStatus?: SellerStatus;
  identificationNumber: {
    value: string;
  };
  identificationType: {
    label: string;
    value: string;
  };
  address: {
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
  };
}
