'use client';

import { gql } from 'graphql-request';

export const QUEUE_MASS_UPLOAD_IMPORT_MUTATION = gql`
  mutation QueueMassUploadImport(
    $profileId: Int!
    $importMode: ImportModeEnum!
    $imagesZipPath: String
  ) {
    queueMassUploadImport(
      profile_id: $profileId
      import_mode: $importMode
      images_zip_path: $imagesZipPath
    ) {
      import_mode
      job_id
      message
      profile_id
      status
      success
    }
  }
`;
