import { gql } from 'graphql-request';

export const GET_CITIES = gql`
  query ($regionId: Int!) {
    regionCities(region_id: $regionId) {
      items {
        id
        code
        name
      }
    }
  }
`;
