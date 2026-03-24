'use client';

import type { CreateProductPayload } from 'src/interfaces';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProduct } from './create-product';

// ----------------------------------------------------------------------

type UseCreateProductOptions = {
  onSuccess?: (data: { sku: string; success: boolean }) => void;
  onError?: (error: Error) => void;
};

/**
 * Hook de React Query que encapsula la mutation de crear producto simple.
 *
 * Al tener éxito, invalida automáticamente la cache de productos
 * para que la lista se refresque sin recargar la página.
 *
 * Uso:
 *   const { mutateAsync, isPending } = useCreateProduct({ onSuccess, onError });
 *   await mutateAsync(payload);
 */
export function useCreateProduct(options: UseCreateProductOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['product', 'create'],
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: async (data) => {
      // Refresca la lista de productos en cache
      await queryClient.invalidateQueries({ queryKey: ['getProducts'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
