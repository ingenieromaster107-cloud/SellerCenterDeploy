'use client';

export const GET_CURRENT_USER_QUERY = `
  query GetCurrentUser {
    customer {
      email
      firstname
      lastname
      seller_profile {
        seller_id
        seller_status
        seller_status_label
        shop_url
      }
    }
  }
`;
