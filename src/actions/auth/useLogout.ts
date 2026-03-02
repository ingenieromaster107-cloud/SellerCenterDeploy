import { useMutation } from '@tanstack/react-query';

import { client, graphqlRequest } from 'src/lib/graphql-client';

import { setSession } from 'src/auth/context/utils';

import { LOGOUT_MUTATION } from "./graphql";


interface LogoutResponse {
  revokeCustomerToken: {
    result: boolean;
  };
}

export function useLogout() {
  return useMutation({
    mutationFn: (variables: any) => graphqlRequest<LogoutResponse>(LOGOUT_MUTATION, variables),
    onSuccess: (data) => {
      const result = data.revokeCustomerToken.result;
      if (result) {
        setSession(null);
        client.setHeader('Authorization', '');
      }
    },
  });
}
