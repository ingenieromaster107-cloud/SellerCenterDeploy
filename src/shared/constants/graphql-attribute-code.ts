export const AttributeCode = {
  TipoIdentificacionUsuario: 'tipo_identificacion_usuario',
  Reason: 'reason',
  Condition: 'condition',
  Resolution: 'resolution',
} as const;

export type AttributeCodeType =
  typeof AttributeCode[keyof typeof AttributeCode];