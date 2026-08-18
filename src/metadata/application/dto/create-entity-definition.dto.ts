import { FieldType } from '@/metadata/enums/field-type.enum';

export interface CreateFieldDto {
  technicalName: string;
  label: string;
  type: FieldType;
  isRequired?: boolean;
  isUnique?: boolean;
}

export interface CreateEntityDefinitionDto {
  tenantId: string;
  technicalName: string;
  displayName: string;
  isAuditable?: boolean;
  fields: CreateFieldDto[];
}
