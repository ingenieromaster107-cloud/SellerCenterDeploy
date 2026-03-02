import { useMutation } from '@tanstack/react-query';

import { client, graphqlRequest } from 'src/lib/graphql-client';

import { setSession } from 'src/auth/context/utils';

import { LOGIN_MUTATION } from "./graphql";


interface LoginResponse {
  generateCustomerToken: {
    token: string;
  };
}

export function useLogin() {
  return useMutation({
    mutationFn: (variables: any) => graphqlRequest<LoginResponse>(LOGIN_MUTATION, variables),
    onSuccess: async (data) => {
      const token = await data.generateCustomerToken.token;
      setSession(token);
      client.setHeader('Authorization', `Bearer ${token}`);
    },
  });
}
