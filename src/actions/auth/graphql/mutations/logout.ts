'use client';

import { gql } from 'graphql-request';

export const LOGOUT_MUTATION = gql`
  mutation RevokeCustomerToken {
    revokeCustomerToken {
      result
    }
  }
`;
