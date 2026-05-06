'use client';

import { gql } from 'graphql-request';

export const START_MASS_UPLOAD_IMPORT_MUTATION = gql`
  mutation StartMassUploadImport($profileId: Int!, $importMode: ImportModeEnum!) {
    startMassUploadImport(profile_id: $profileId, import_mode: $importMode) {
      success
      message
      profile_id
      summary {
        total_rows
        processed_rows
        success_rows
        failed_rows
      }
      results {
        row
        product_id
        status
        message
        errors {
          field
          message
        }
        updatedFields
      }
    }
  }
`;
