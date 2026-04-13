'use client';

import type { PageInfo } from 'src/interfaces/graphql/graphql-shared.interfaces';
import type { ProductListInterface, SellerProductsResponseInterface } from 'src/interfaces';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { GraphQLService } from 'src/lib/graphql-client';

import { SELLER_PRODUCTS_QUERY } from './graphql/queries';
import { productListAdapter } from './adapters/product-list-adapter';

export function useGetProducts(productsPerPage: PageInfo) {
  const graphql = GraphQLService.getInstance();
  const { currentLang } = useTranslate();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['getProducts', productsPerPage],
    queryFn: () =>
      graphql.request<SellerProductsResponseInterface, PageInfo>(
        SELLER_PRODUCTS_QUERY,
        productsPerPage
      ),
    placeholderData: (previousData) => previousData,
    // staleTime: 1000 * 60 * 5, // Mantiene los datos actualizados por 5 minutos
  });

  const products = useMemo<ProductListInterface[]>(
    () => productListAdapter(data, currentLang),
    [data, currentLang]
  );
  const totalCount: number = data?.sellerProducts?.total_count || 0;
  const pageInfo: PageInfo | undefined = data?.sellerProducts?.page_info;
  return { products, isLoading, isError, isFetching, totalCount, pageInfo };
}
