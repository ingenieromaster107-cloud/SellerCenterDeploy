'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';
import { GET_CUSTOMER } from './graphql/queries';
import { ICustomer } from 'src/interfaces/customer/customer.interface';
import { CustomerAdapter } from './adapters/customer-adapter';
import { setCustomerSession } from 'src/auth/context';

export function useGetCustomer() {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getCustomer'],
    queryFn: () => graphql.request<ICustomer, {}>(GET_CUSTOMER),
  });

  const customer = useMemo<ICustomer>(() => CustomerAdapter(data!), [data]);
  //setCustomerSession(customer.customer);
  return { customer, isLoading, isError };
}
