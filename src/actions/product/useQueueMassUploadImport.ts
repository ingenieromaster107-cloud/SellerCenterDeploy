'use client';

import type {
  QueueMassUploadImportRequestInterface,
  QueueMassUploadImportResponseInterface,
} from 'src/interfaces/load/bulk-loading.interface';

import { useMutation } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { queueMassUploadImportAdapter } from './adapters/queue-mass-upload-import-adapter';
import { QUEUE_MASS_UPLOAD_IMPORT_MUTATION } from './graphql/mutations/queue-mass-upload-import';

export function useQueueMassUploadImport() {
  const graphql = GraphQLService.getInstance();
  return useMutation({
    mutationFn: async (
      request: QueueMassUploadImportRequestInterface
    ): Promise<QueueMassUploadImportResponseInterface> => {
      const data = await graphql.request<
        QueueMassUploadImportResponseInterface,
        QueueMassUploadImportRequestInterface
      >(QUEUE_MASS_UPLOAD_IMPORT_MUTATION, request);
      return queueMassUploadImportAdapter(data);
    },
  });
}
