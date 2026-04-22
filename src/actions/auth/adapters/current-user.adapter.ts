import type { CurrentUserGQLResponse } from '../use-current-user';
import type { Customer } from 'src/interfaces/customer/customer.interface';


export function currentUserAdapter(data: CurrentUserGQLResponse): Customer {
  const customer = data.customer;

  return {
    email: customer.email ?? '',
    firstname: customer.firstname ?? '',
    lastname: customer.lastname ?? '',
  } as Customer;
};
