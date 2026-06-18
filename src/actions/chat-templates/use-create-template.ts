'use client';

import type { ChatTemplate } from 'src/interfaces/chat-templates/chat-templates.list';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { CREATE_TEMPLATE } from './graphql/mutations/create-template';

type CreateTemplateInput = {
  content: string;
  is_active: number;
  title: string;
};

type Options = {
  onSuccess?: (data: ChatTemplate) => void;
  onError?: (error: Error) => void;
};

export function useCreateTemplate(options: Options = {}) {
  const queryClient = useQueryClient();
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationKey: ['chatTemplate', 'create'],
    mutationFn: (input: CreateTemplateInput) =>
      graphql
        .request<{ interSellersCreateResponseTemplate: ChatTemplate }, CreateTemplateInput>(
          CREATE_TEMPLATE,
          input
        )
        .then((res) => res.interSellersCreateResponseTemplate),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['getTemplatesList'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
