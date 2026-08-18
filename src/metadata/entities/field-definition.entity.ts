import { BaseEntity } from '@/core/domain/entities/base.entity';
import { FieldType } from '../enums/field-type.enum';

export class FieldDefinition extends BaseEntity {
  technicalName!: string;
  label!: string;
  type!: FieldType;
  isRequired!: boolean;
  isUnique!: boolean;
  defautValue?: string;

  constructor(partial: Partial<FieldDefinition>) {
    super(partial.id, partial.createdAt, partial.updatedAt);
    Object.assign(this, partial);

    this.isRequired = partial.isRequired ?? false;
    this.isUnique = partial.isUnique ?? false;
  }
}
