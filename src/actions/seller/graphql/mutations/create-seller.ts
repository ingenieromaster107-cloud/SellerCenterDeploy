// ----------------------------------------------------------------------
// Construye la mutation `createCustomerV2` solo con los doc fields que
// aplican según el caso (país + tipo de persona). Esto evita pasar `null`
// para documentos que el backend no espera para esa combinación.
// ----------------------------------------------------------------------

const camelCase = (snake: string) => snake.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

export function getDocVarBaseName(code: string) {
  return camelCase(code);
}

export function buildCreateCustomerMutation(docCodes: string[]): string {
  const docVarDecls = docCodes
    .flatMap((code) => {
      const base = camelCase(code);
      return [`    $${base}FileName: String!`, `    $${base}FileContent: String!`];
    })
    .join('\n');

  const docFields = docCodes
    .map((code) => {
      const base = camelCase(code);
      return `          ${code}: { file_name: $${base}FileName, file_content: $${base}FileContent }`;
    })
    .join('\n');

  return `
    mutation CreateCustomerV2(
      $firstname: String!
      $lastname: String!
      $email: String!
      $password: String!
      $numeroIdentificacionUsuario: String!
      $tipoIdentificacionUsuario: String!
      $tipoIdentificacionUsuarioValue: String!
      $personalTelephone: String!
      $countryCode: String!
      $typePerson: String!
      $shopUrl: String!
      $nationalId: String!
      $sellerCategory: String!
      $street: String!
      $city: String!
      $region: String!
      $postcode: String!
      $telephone: String!
${docVarDecls}
    ) {
      createCustomerV2(
        input: {
          firstname: $firstname
          lastname: $lastname
          email: $email
          password: $password
          custom_attributes: [
            { attribute_code: "numero_identificacion_usuario", value: $numeroIdentificacionUsuario }
            {
              attribute_code: "tipo_identificacion_usuario"
              selected_options: [{ value: $tipoIdentificacionUsuario }]
              value: $tipoIdentificacionUsuarioValue
            }
            { attribute_code: "personal_telephone", value: $personalTelephone }
          ]
          is_seller: true
          seller: {
            type_person: $typePerson
            shop_url: $shopUrl
            national_id: $nationalId
            seller_category: $sellerCategory
            address: {
              street: [$street]
              city: $city
              region: $region
              postcode: $postcode
              country_code: $countryCode
              telephone: $telephone
            }
${docFields}
          }
        }
      ) {
        customer {
          firstname
          lastname
          email
        }
      }
    }
  `;
}
