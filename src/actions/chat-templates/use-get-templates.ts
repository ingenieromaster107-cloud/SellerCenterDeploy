import type { ChatTemplateResponse } from 'src/interfaces/chat-templates/chat-templates.list';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_TEMPLATES_LIST } from './graphql/queries/get-templates-list';

export function useGetTemplates() {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getTemplatesList'],
    queryFn: () => graphql.request<ChatTemplateResponse>(GET_TEMPLATES_LIST),
  });
  return { data, isLoading, isError, error };
}
