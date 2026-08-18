import { BaseEntity } from '@/core/domain/entities/base.entity';
import { FieldDefinition } from './field-definition.entity';

export class EntityDefinition extends BaseEntity {
  tenantId!: string;
  technicalName!: string;
  displayName!: string;
  tableName!: string;
  isCustom!: boolean;
  isAuditable!: boolean;
  fields!: FieldDefinition[];

  constructor(partial: Partial<EntityDefinition>) {
    super(partial.id, partial.createdAt, partial.updatedAt);
    Object.assign(this, partial);

    this.isCustom = partial.isCustom ?? true;
    this.isAuditable = partial.isAuditable ?? true;
    this.fields = partial.fields ?? [];
    this.tableName = partial.tableName ?? 'dynamic_records';
  }

  addField(field: FieldDefinition): void {
    const fieldExists = this.fields.find((f) => f.technicalName === field.technicalName);

    if (fieldExists) {
      throw new Error(`O campo '${field.technicalName}' já existe.`);
    }
    this.fields.push(field);
    this.markAsUpdated();
  }
}
