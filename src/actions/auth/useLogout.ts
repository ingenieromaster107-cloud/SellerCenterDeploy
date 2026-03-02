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
    onSuccess: async (data) => {
      await data.revokeCustomerToken.result;
      setSession(null);
      client.setHeader('Authorization', '');
    },
  });
}
