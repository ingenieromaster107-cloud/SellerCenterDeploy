'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { DELETE_TEMPLATE } from './graphql/mutations/delete-template';

type DeleteTemplateResponse = {
  message: string;
  success: boolean;
};

type Options = {
  onSuccess?: (data: DeleteTemplateResponse) => void;
  onError?: (error: Error) => void;
};

export function useDeleteTemplate(options: Options = {}) {
  const queryClient = useQueryClient();
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationKey: ['chatTemplate', 'delete'],
    mutationFn: (entity_id: number) =>
      graphql
        .request<
          { interSellersDeleteResponseTemplate: DeleteTemplateResponse },
          { entity_id: number }
        >(DELETE_TEMPLATE, { entity_id })
        .then((res) => res.interSellersDeleteResponseTemplate),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['getTemplatesList'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
