import { useMutation } from '@tanstack/react-query';

import { graphqlRequest } from 'src/lib/graphql-client';

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
    onSuccess: (data) => {
      const token = data.generateCustomerToken.token;
      setSession(token);
    },
  });
}
