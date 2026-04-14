
import type { Regions } from "src/interfaces/regions/regions-response.interface";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { GraphQLService } from "src/lib/graphql-client";

import { RegionAdapter } from "./adapters/regions-adapter";
import { GET_REGIONS } from "./graphql/queries/get-regions";


export function useGetRegions(countryId: string = 'CO') {
  const graphql = GraphQLService.getInstance();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getRegions', countryId],
    queryFn: () => graphql.request<Regions, { countryId: string }>(GET_REGIONS, { countryId }),
  });
  
  const regions = useMemo(() => RegionAdapter(data!), [data]);
    return { regions, isLoading, isError, error };
}
