'use client';

import type { ICustomer } from 'src/interfaces/customer/customer.interface';

import { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { setCustomerStorage } from 'src/auth/context';

import { GET_CUSTOMER } from './graphql/queries';
import { CustomerAdapter } from './adapters/customer-adapter';

export function useGetCustomer() {
  const graphql = GraphQLService.getInstance();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getCustomer'],
    queryFn: () => graphql.request<ICustomer, {}>(GET_CUSTOMER),
  });

  console.log("data:", data);

  // const customer = useMemo(() => {
  //   if (!data) return null;
  //   return CustomerAdapter(data);
  // }, [data]);

  const customer = useMemo(() => CustomerAdapter(data!), [data]);

  // useEffect(() => {
  //   if (customer) {
  //     setCustomerStorage(customer);
  //   }
  // }, [customer]);

  return { customer, isLoading, isError };
}
