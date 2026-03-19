import { ICustomer } from 'src/interfaces/customer/customer.interface';

export function CustomerAdapter(data: ICustomer): ICustomer {
  if (!data || !('customer' in data)) {
    console.warn('No found customer info');
    return {} as ICustomer;
  }

  const infoCustomer: ICustomer = data;

   const addresses = infoCustomer.addresses ?? [];

   const defaultShipping =
    addresses.find((addr) => addr.default_shipping) || addresses[0] || null;

  return {
    ...infoCustomer,
    addresses,
  }
}
