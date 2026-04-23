
import type { Customer } from 'src/interfaces/customer/customer.interface';
import type { CustomerResponse } from 'src/interfaces/customer/customer-response.interface';

export function CustomerAdapter(data: CustomerResponse): Customer {
  if (!data || !('customer' in data)) {
    console.warn('No found customer info');
    return {} as Customer;
  }

  const addresses = data.customer.addresses ?? [];
  const defaultShipping = addresses.find((addr) => addr.default_shipping) || addresses[0] || null;

  data.customer.addresses = defaultShipping ? [defaultShipping] : addresses[0] ? [addresses[0]] : [];
  
  return{
    firstname: data.customer.firstname,
    lastname: data.customer.lastname,
    email: data.customer.email,
    identificationNumber: { value: data.customer.identificationNumber[0]?.value || '' },
    identificationType: { 
      label: data.customer.identificationType[0]?.selected_options[0]?.label || '', 
      value: data.customer.identificationType[0]?.selected_options[0]?.value || '' 
    },
    address: defaultShipping,
  };
}