import type { GraphQLErrorResponseInterface } from 'src/interfaces/graphql';
import type { StartMassUploadImportResponseInterface } from 'src/interfaces/load/bulk-loading.interface';

const EMPTY_RESPONSE: StartMassUploadImportResponseInterface = {
  startMassUploadImport: {
    success: false,
    message: 'No data found',
    profile_id: 0,
    summary: { total_rows: 0, processed_rows: 0, success_rows: 0, failed_rows: 0 },
    results: [],
  },
};

export function startMassUploadImportAdapter(
  data: StartMassUploadImportResponseInterface | GraphQLErrorResponseInterface | undefined
): StartMassUploadImportResponseInterface {
  if (!data || !('startMassUploadImport' in data)) return EMPTY_RESPONSE;

  const payload = data.startMassUploadImport;
  return {
    startMassUploadImport: {
      success: !!payload?.success,
      message: payload?.message ?? '',
      profile_id: payload?.profile_id ?? 0,
      summary: {
        total_rows: payload?.summary?.total_rows ?? 0,
        processed_rows: payload?.summary?.processed_rows ?? 0,
        success_rows: payload?.summary?.success_rows ?? 0,
        failed_rows: payload?.summary?.failed_rows ?? 0,
      },
      results: Array.isArray(payload?.results)
        ? payload.results.map((r) => ({
            row: r?.row ?? 0,
            product_id: r?.product_id ?? null,
            status: r?.status ?? 'failed',
            message: r?.message ?? '',
            errors: Array.isArray(r?.errors)
              ? r.errors.map((e) => ({ field: e?.field ?? '', message: e?.message ?? '' }))
              : [],
            updatedFields: Array.isArray(r?.updatedFields) ? r.updatedFields : [],
          }))
        : [],
    },
  };
}
