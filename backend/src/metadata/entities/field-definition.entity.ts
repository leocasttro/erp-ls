import { BaseEntity } from '@/core/domain/entities/base.entity';
import { FieldType } from '../enums/field-type.enum';

export class FieldDefinition extends BaseEntity {
  tenantId!: string;
  entityDefinition!: string;
  technicalName!: string;
  label!: string;
  fieldType!: FieldType;

  isRequired!: boolean;
  isUnique!: boolean;
  isIndexed!: boolean;
  isCalculated!: boolean;

  formulaExpression?: string;
  defaultValue?: string;
  validationRules?: Record<string, unknown>;
  lookupEntityId?: string;
  onDeleteAction?: string;
  options?: Record<string, unknown>;

  constructor(partial: Partial<FieldDefinition>) {
    super(partial.id, partial.createdAt, partial.updatedAt);
    Object.assign(this, partial);

    this.isRequired = partial.isRequired ?? false;
    this.isUnique = partial.isUnique ?? false;
    this.isIndexed = partial.isIndexed ?? false;
    this.isCalculated = partial.isCalculated ?? false;
  }
}
