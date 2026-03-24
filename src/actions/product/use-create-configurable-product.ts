'use client';

import type { CreateConfigurableProductPayload } from 'src/interfaces';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createConfigurableProduct } from './create-configurable-product';

// ----------------------------------------------------------------------

type CreateConfigurableResult = {
  status: string;
  skuStatus: { sku: string; created: boolean; message: string }[];
  message: string;
};

type UseCreateConfigurableProductOptions = {
  onSuccess?: (data: CreateConfigurableResult) => void;
  onError?: (error: Error) => void;
};

/**
 * Hook de React Query que encapsula la mutation de crear producto configurable.
 *
 * Envía padre + hijos en una sola llamada. Al tener éxito, invalida
 * la cache de productos para que la lista se refresque.
 */
export function useCreateConfigurableProduct(options: UseCreateConfigurableProductOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['product', 'create-configurable'],
    mutationFn: (payload: CreateConfigurableProductPayload) => createConfigurableProduct(payload),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['getProducts'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
