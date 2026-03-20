
import type { ICustomer, ICustomerGraphQLResponse } from 'src/interfaces/customer/customer.interface';

import { useState } from 'react';

export function CustomerAdapter(data: ICustomerGraphQLResponse): ICustomer {
  if (!data || !('customer' in data)) {
    console.warn('No found customer info');
    return {} as ICustomer;
  }
  // console.log("dataadsas:", data);
  // const infoCustomer: ICustomer = data;

  // const addresses = infoCustomer.addresses ?? [];

  // const defaultShipping = addresses.find((addr) => addr.default_shipping) || addresses[0] || null;
  // const finalOject: ICustomer = {
  //   ...infoCustomer,
  //   addresses: defaultShipping ? [defaultShipping] : [],
  // }

  // infoCustomer.addresses = defaultShipping ? [defaultShipping] : [];

  return data.customer;
}
