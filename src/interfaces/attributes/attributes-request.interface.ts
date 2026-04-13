import type { EntityTypeType } from "src/shared/constants/graphql-entity-type";
import type { AttributeCodeType } from "src/shared/constants/graphql-attribute-code";

export interface IAttributesRequest {
  attributeCode: AttributeCodeType;
  entityType: EntityTypeType;
}