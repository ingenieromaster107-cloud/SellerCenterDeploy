import { useMutation } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { SELLER_MOVEMENTS_EXPORT_CSV_QUERY } from './graphql/queries';

type ExportParams = {
  dateFrom: string;
  dateTo: string;
};

type GqlExportResponse = {
  sellerMovementsExportCsv: string;
};

export function useExportMovements() {
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationKey: ['movements:export'],
    mutationFn: async ({ dateFrom, dateTo }: ExportParams): Promise<string> => {
      const response = await graphql.request<
        GqlExportResponse,
        { date_from: string; date_to: string }
      >(SELLER_MOVEMENTS_EXPORT_CSV_QUERY, {
        date_from: dateFrom,
        date_to: dateTo,
      });
      return response.sellerMovementsExportCsv;
    },
  });
}
