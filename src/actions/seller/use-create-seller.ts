import { useMutation } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { getDocVarBaseName, buildCreateCustomerMutation } from './graphql/mutations/create-seller';

// ----------------------------------------------------------------------

export type SellerDocumentPayload = {
  file_name: string;
  /** base64 (sin el prefijo data:URI) */
  file_content: string;
};

export type CreateSellerInput = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  /** Número de identificación del usuario (texto libre) */
  numeroIdentificacionUsuario: string;
  /** Label del tipo de identificación tal como llega del API de attributes (ej: "Cédula de ciudadanía") */
  tipoIdentificacionUsuario: string;
  /** Value del tipo de identificación tal como llega del API de attributes (ej: "85") */
  tipoIdentificacionUsuarioValue: string;
  countryCode: string;
  typePerson: string;
  shopUrl: string;
  nationalId: string;
  /** Nombre de la categoría principal elegida en step 1 (no id). */
  sellerCategory: string;
  /** Calle / dirección de la tienda (se envía como `street: [street]`). */
  street: string;
  /** Nombre de ciudad (no id). El backend persiste el texto. */
  city: string;
  /** Nombre de región/estado (no id). */
  region: string;
  /** Código postal — opcional para el usuario, pero el backend exige String!, por eso default `''`. */
  postcode: string;
  /** Teléfono en E.164 (`+57…`). Se envía tanto a `address.telephone` como a `personal_telephone`. */
  telephone: string;
  /** Documentos en base64. La key debe coincidir con el código que espera el backend. */
  documents: Record<string, SellerDocumentPayload>;
};

export interface CreateCustomerV2Response {
  createCustomerV2: {
    customer: {
      firstname: string;
      lastname: string;
      email: string;
    };
  };
}

// ----------------------------------------------------------------------

export function useCreateSeller() {
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationFn: async (input: CreateSellerInput) => {
      const docCodes = Object.keys(input.documents);
      const mutation = buildCreateCustomerMutation(docCodes);

      const variables: Record<string, string> = {
        firstname: input.firstname,
        lastname: input.lastname,
        email: input.email,
        password: input.password,
        numeroIdentificacionUsuario: input.numeroIdentificacionUsuario,
        tipoIdentificacionUsuario: input.tipoIdentificacionUsuario,
        tipoIdentificacionUsuarioValue: input.tipoIdentificacionUsuarioValue,
        personalTelephone: input.telephone,
        countryCode: input.countryCode,
        typePerson: input.typePerson,
        shopUrl: input.shopUrl,
        nationalId: input.nationalId,
        sellerCategory: input.sellerCategory,
        street: input.street,
        city: input.city,
        region: input.region,
        postcode: input.postcode,
        telephone: input.telephone,
      };

      for (const [code, doc] of Object.entries(input.documents)) {
        const base = getDocVarBaseName(code);
        variables[`${base}FileName`] = doc.file_name;
        variables[`${base}FileContent`] = doc.file_content;
      }

      return graphql.request<CreateCustomerV2Response, typeof variables>(mutation, variables);
    },
  });
}
