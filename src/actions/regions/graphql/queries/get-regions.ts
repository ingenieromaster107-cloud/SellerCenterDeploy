import { gql } from 'graphql-request';

export const GET_REGIONS = gql`
  query ($countryId: String!) {
    country(id: $countryId) {
      available_regions {
        code
        id
        name
      }
    }
  }
`;
