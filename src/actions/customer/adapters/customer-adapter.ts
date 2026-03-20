
import type { ICustomer } from 'src/interfaces/customer/customer.interface';

import { useState } from 'react';

export function CustomerAdapter(data: ICustomer): ICustomer {
  if (!data || !('customer' in data)) {
    console.warn('No found customer info');
    return {} as ICustomer;
  }
  const obj = data;

  console.log("data:", data.customer);
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
