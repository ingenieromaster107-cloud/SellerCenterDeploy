'use client';

import { gql } from 'graphql-request';

export const GET_TOKEN_LIFETIME_QUERY = gql`
  query GetTokenLifetime {
    storeConfig {
      customer_access_token_lifetime
    }
  }
`;
