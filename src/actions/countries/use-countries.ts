import type { Countries } from 'src/interfaces/countries/countries-response.interface';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_COUNTRIES } from './graphql/queries/get-countries';
import { CountriesAdapter } from './adapters/countries-adapter';

export function useGetCountries() {
  const graphql = GraphQLService.getInstance();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getCountries'],
    queryFn: () => graphql.request<Countries>(GET_COUNTRIES),
  });

  const countries = useMemo(() => CountriesAdapter(data!), [data]);
  return { countries, isLoading, isError };
}
