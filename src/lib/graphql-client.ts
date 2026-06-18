// src/lib/graphql/GraphQLService.ts

import { GraphQLClient } from 'graphql-request';

import { ENV } from 'src/environments';

import { getSession } from 'src/auth/context';

type UnauthorizedHandler = () => void;

export class GraphQLService {
  private static instance: GraphQLService;
  private client: GraphQLClient;

  /**
   * Callback invocado cuando el backend responde con 401 (o un error GraphQL de
   * autorización). Lo registra el AuthProvider para forzar el cierre de sesión y
   * la redirección limpia al login, evitando bucles de error con tokens vencidos.
   */
  private unauthorizedHandler: UnauthorizedHandler | null = null;

  private constructor() {
    const urlBackend = ENV.urlBackend;

    if (!urlBackend) {
      throw new Error('NEXT_PUBLIC_BACKEND_GRAPHQL_URL is not defined');
    }

    const isBrowser = typeof window !== 'undefined';

    const localUrl = isBrowser
      ? `${window.location.origin}/api/magento/graphql`
      : '/api/magento/graphql';

    // Temporalmente se usa la URL local para evitar problemas de CORS.
    //const endpoint = ENV.environment === 'local' ? localUrl : urlBackend;
    const endpoint = localUrl;

    this.client = new GraphQLClient(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public static getInstance(): GraphQLService {
    if (!GraphQLService.instance) {
      GraphQLService.instance = new GraphQLService();

      if (getSession()) {
        GraphQLService.instance.setHeader('Authorization', `Bearer ${getSession()}`);
      }
    }

    return GraphQLService.instance;
  }

  public setHeader(key: string, value: string) {
    this.client.setHeader(key, value);
  }

  public setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
    this.unauthorizedHandler = handler;
  }

  public async request<TData, TVariables extends Record<string, any> = Record<string, never>>(query: string, variables?: TVariables): Promise<TData> {
    try {
      return await this.client.request<TData>(query, variables as TVariables);
    } catch (error) {
      if (GraphQLService.isUnauthorizedError(error)) {
        this.unauthorizedHandler?.();
      }
      throw error;
    }
  }

  /**
   * Detecta un error de autenticación/sesión expirada: un HTTP 401 del backend
   * o un error GraphQL con categoría `graphql-authorization` (token inválido o
   * vencido en Magento). No considera `graphql-authentication`, que corresponde
   * a credenciales incorrectas en el propio login y no debe forzar la purga.
   */
  private static isUnauthorizedError(error: unknown): boolean {
    const response = (
      error as {
        response?: {
          status?: number;
          errors?: Array<{ extensions?: { category?: string } }>;
        };
      }
    )?.response;

    if (response?.status === 401) {
      return true;
    }

    return (response?.errors ?? []).some(
      (err) => err?.extensions?.category === 'graphql-authorization'
    );
  }
}
