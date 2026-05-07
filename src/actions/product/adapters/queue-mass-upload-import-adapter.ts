import type { GraphQLErrorResponseInterface } from 'src/interfaces/graphql';
import type { QueueMassUploadImportResponseInterface } from 'src/interfaces/load/bulk-loading.interface';

const EMPTY_RESPONSE: QueueMassUploadImportResponseInterface = {
  queueMassUploadImport: {
    success: false,
    message: 'No data found',
    profile_id: 0,
    job_id: 0,
    status: 'unknown',
    import_mode: '',
  },
};

export function queueMassUploadImportAdapter(
  data: QueueMassUploadImportResponseInterface | GraphQLErrorResponseInterface | undefined
): QueueMassUploadImportResponseInterface {
  if (!data || !('queueMassUploadImport' in data)) return EMPTY_RESPONSE;

  const payload = data.queueMassUploadImport;
  return {
    queueMassUploadImport: {
      success: !!payload?.success,
      message: payload?.message ?? '',
      profile_id: payload?.profile_id ?? 0,
      job_id: payload?.job_id ?? 0,
      status: payload?.status ?? 'unknown',
      import_mode: payload?.import_mode ?? '',
    },
  };
}
