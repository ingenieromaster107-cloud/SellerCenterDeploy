import { gql } from 'graphql-request';

export const GET_SUBACCOUNTS_QUERY = gql`
query GetSellerSubAccounts {
    getSellerSubAccounts {
      created_at
      customer_id
      email
      entity_id
      firstname
      lastname
      parent_account_id
      permission_type
      seller_id
      status
      updated_at
    }
}
`;
