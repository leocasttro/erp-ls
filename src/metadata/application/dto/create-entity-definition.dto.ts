import { FieldType } from '@/metadata/enums/field-type.enum';
import { RelationType } from '@/metadata/enums/relation-type.enum';

export interface CreateFieldDto {
  technicalName: string;
  label: string;
  fieldType: FieldType;
  isRequired?: boolean;
  isUnique?: boolean;
  isIndexed?: boolean;
  isCalculated?: boolean;
  formulaExpression?: string;
  defaultValue?: string;
  validationRules?: Record<string, unknown>;
  lookupEntityId?: string;
  onDeleteAction?: string;
}

export interface CreateFormLayoutDto {
  name: string;
  isDefault?: boolean;
  layoutConfig: Record<string, unknown>;
}

export interface CreateEntityRelationDto {
  targetEntityId: string;
  relationType: RelationType;
  foreignKeyName: string;
  cascadeDelete?: boolean;
  label?: string;
}

export interface CreateEntityDefinitionDto {
  tenantId: string;
  technicalName: string;
  displayName: string;
  tableName?: string;
  moduleCategory?: string;
  isCustom?: boolean;
  isAuditable?: boolean;
  hasWorkflow?: boolean;
  fields: CreateFieldDto[];
  formLayouts?: CreateFormLayoutDto[];
  relations?: CreateEntityRelationDto[];
}
