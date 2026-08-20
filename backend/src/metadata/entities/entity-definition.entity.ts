import { BaseEntity } from '@/core/domain/entities/base.entity';
import { FieldDefinition } from './field-definition.entity';
import { FormLayout } from './form-layout.entity';
import { EntityRelation } from './entity-relation.entity';

export class EntityDefinition extends BaseEntity {
  tenantId!: string;
  technicalName!: string;
  displayName!: string;
  tableName!: string;
  moduleCategory?: string;
  isCustom!: boolean;
  isAuditable!: boolean;
  hasWorkflow!: boolean;
  fields!: FieldDefinition[];
  formLayouts!: FormLayout[];
  sourceRelations!: EntityRelation[];
  targetRelations!: EntityDefinition[];

  constructor(partial: Partial<EntityDefinition>) {
    super(partial.id, partial.createdAt, partial.updatedAt);
    Object.assign(this, partial);

    this.isCustom = partial.isCustom ?? true;
    this.isAuditable = partial.isAuditable ?? true;
    this.hasWorkflow = partial.hasWorkflow ?? false;
    this.fields = partial.fields ?? [];
    this.formLayouts = partial.formLayouts ?? [];
    this.sourceRelations = partial.sourceRelations ?? [];
    this.targetRelations = partial.targetRelations ?? [];
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

  addFormLayout(layout: FormLayout): void {
    if (layout.isDefault && this.formLayouts.some((l) => l.isDefault)) {
      throw new Error('Já existe um formulário padrão para esta entidade');
    }

    this.formLayouts.push(layout);
    this.markAsUpdated();
  }

  addRelation(relation: EntityRelation): void {
    const relationExists = this.sourceRelations.find(
      (r) => r.foreignKeyName === relation.foreignKeyName,
    );

    if (relationExists) throw new Error(`A relação '${relation.foreignKeyName}' já existe.`);

    this.sourceRelations.push(relation);
    this.markAsUpdated();
  }
}
