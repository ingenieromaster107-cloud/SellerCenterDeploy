import { gql } from 'graphql-request';

export const GET_CUSTOMER = gql`
  query {
    customer {
      firstname
      lastname
      email
      identificationNumber: custom_attributes(attributeCodes: "numero_identificacion_usuario") {
        ... on AttributeValue {
          value
        }
      }
      identificationType: custom_attributes(attributeCodes: "tipo_identificacion_usuario") {
        ... on AttributeSelectedOptions {
          selected_options {
            label
            value
          }
        }
      }
      addresses {
        id
        firstname
        lastname
        street
        city
        region {
          region_id
          region_code
        }
        country_code
        telephone
        postcode
        default_billing
        default_shipping
      }
    }
  }
`;
