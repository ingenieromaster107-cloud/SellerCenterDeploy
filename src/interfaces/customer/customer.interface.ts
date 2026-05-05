import type { SellerProfile } from 'src/interfaces/seller/seller-profile';

export interface Customer {
  firstname: string;
  lastname: string;
  email: string;
  /**
   * Perfil del seller (estado de vinculación, shop URL, etc.). Opcional
   * para usuarios que aún no son sellers o cuando el backend no devuelve
   * el bloque `seller_profile`.
   */
  sellerProfile?: SellerProfile;
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
