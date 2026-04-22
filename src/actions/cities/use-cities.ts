import type { Cities } from 'src/interfaces/cities/cities-response.interface';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_CITIES } from './graphql/queries/get-cities';
import { CitiesAdapter } from './adapters/cities-adapter';

export function useGetCities(regionId: number) {
  const graphql = GraphQLService.getInstance();

  const enabled = regionId !== 0 && !isNaN(regionId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getCities', regionId],
    queryFn: () => graphql.request<Cities, { regionId: number }>(GET_CITIES, { regionId }),
    enabled,
  });

  const cities = useMemo(() => (data ? CitiesAdapter(data) : []), [data]);

  return {
    cities: enabled ? cities : [],
    isLoading: enabled ? isLoading : false,
    isError: enabled ? isError : false,
    error: enabled ? error : null,
  };
}
