import type { SellerProfile } from 'src/interfaces/seller/seller-profile';
import type { Customer } from 'src/interfaces/customer/customer.interface';

import { sellerStatusFromCode } from 'src/interfaces/seller/seller-status';

// ----------------------------------------------------------------------

interface SellerProfileGQL {
  seller_id?: number | null;
  seller_status?: number | null;
  seller_status_label?: string | null;
  shop_url?: string | null;
}

interface CustomerGQL {
  email?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  seller_profile?: SellerProfileGQL | null;
}

export interface CurrentUserGQLResponse {
  customer: CustomerGQL;
}

// ----------------------------------------------------------------------

const adaptSellerProfile = (raw?: SellerProfileGQL | null): SellerProfile | undefined => {
  if (!raw) return undefined;

  const code = raw.seller_status ?? -1;
  return {
    sellerId: raw.seller_id ?? 0,
    status: sellerStatusFromCode(code),
    statusCode: code,
    statusLabel: raw.seller_status_label ?? '',
    shopUrl: raw.shop_url ?? '',
  };
};

export function currentUserAdapter(data: CurrentUserGQLResponse): Customer {
  const { customer } = data;

  return {
    email: customer.email ?? '',
    firstname: customer.firstname ?? '',
    lastname: customer.lastname ?? '',
    sellerProfile: adaptSellerProfile(customer.seller_profile),
  } as Customer;
}
