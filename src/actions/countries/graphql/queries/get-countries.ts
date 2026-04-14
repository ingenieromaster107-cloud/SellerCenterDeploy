import { gql } from 'graphql-request';

export const GET_COUNTRIES = gql`
  query {
    countries {
      id
      full_name_locale
    }
  }
`;
