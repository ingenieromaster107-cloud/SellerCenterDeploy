'use client';

import type { ChatTemplate } from 'src/interfaces/chat-templates/chat-templates.list';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { UPDATE_TEMPLATES_LIST } from './graphql/mutations/update-template';

type UpdateTemplateInput = {
  entity_id: number;
  is_active: number;
  title: string;
  content: string;
};

type Options = {
  onSuccess?: (data: ChatTemplate) => void;
  onError?: (error: Error) => void;
};

export function useUpdateTemplate(options: Options = {}) {
  const queryClient = useQueryClient();
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationKey: ['chatTemplate', 'update'],
    mutationFn: (input: UpdateTemplateInput) =>
      graphql
        .request<{ interSellersUpdateResponseTemplate: ChatTemplate }, UpdateTemplateInput>(
          UPDATE_TEMPLATES_LIST,
          input
        )
        .then((res) => res.interSellersUpdateResponseTemplate),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['getTemplatesList'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
