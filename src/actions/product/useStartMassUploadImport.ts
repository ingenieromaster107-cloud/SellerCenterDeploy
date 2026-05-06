'use client';

import type {
  StartMassUploadImportRequestInterface,
  StartMassUploadImportResponseInterface,
} from 'src/interfaces/load/bulk-loading.interface';

import { useMutation } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { startMassUploadImportAdapter } from './adapters/start-mass-upload-import-adapter';
import { START_MASS_UPLOAD_IMPORT_MUTATION } from './graphql/mutations/start-mass-upload-import';

export function useStartMassUploadImport() {
  const graphql = GraphQLService.getInstance();
  return useMutation({
    mutationFn: async (
      request: StartMassUploadImportRequestInterface
    ): Promise<StartMassUploadImportResponseInterface> => {
      const data = await graphql.request<
        StartMassUploadImportResponseInterface,
        StartMassUploadImportRequestInterface
      >(START_MASS_UPLOAD_IMPORT_MUTATION, request);
      return startMassUploadImportAdapter(data);
    },
  });
}
