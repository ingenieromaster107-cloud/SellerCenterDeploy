'use client';

import type { ProductListInterface } from 'src/interfaces/product/product-list-interface';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { graphqlRequest } from 'src/lib/graphql-client';

import { GET_PRODUCTS_QUERY } from './graphql/queries';
import { productListAdapter } from './adapters/product-list-adapter';

export function useGetProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getProducts'],
    queryFn: () => graphqlRequest<any, {}>(GET_PRODUCTS_QUERY),
    // staleTime: 1000 * 60 * 5, // Mantiene los datos actualizados por 5 minutos
  });

  const products = useMemo<ProductListInterface[]>(() => productListAdapter(data), [data]);
  return { products, isLoading, isError };
}