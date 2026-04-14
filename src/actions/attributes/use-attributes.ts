import type { AttributesRequest } from 'src/interfaces/attributes/attributes-request.interface';
import type { AttributesResponse } from 'src/interfaces/attributes/attributes-response.interface';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_ATTRIBUTES } from './graphql/queries/get-attributes';
import { AttributesAdapter } from './adapters/attributes-adapter';

export function useGetAttributes(params: AttributesRequest) {
  const graphql = GraphQLService.getInstance();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getAttributes', params],
    queryFn: () => graphql.request<AttributesResponse, AttributesRequest>(GET_ATTRIBUTES, params),
  });
  
  const attributes = useMemo(() => AttributesAdapter(data!), [data]);
    return { attributes, isLoading, isError, error };
}
