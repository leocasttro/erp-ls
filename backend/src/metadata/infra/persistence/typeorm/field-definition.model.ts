import { FieldType } from '@/metadata/enums/field-type.enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntityDefinitionModel } from './entity-definition.model';

@Entity('field_definitions')
export class FieldDefinitionModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'technical_name' })
  technicalName!: string;

  @Column()
  label!: string;

  @Column({ name: 'type', type: 'varchar' })
  fieldType!: FieldType;

  @Column({ name: 'is_required', default: false })
  isRequired!: boolean;

  @Column({ name: 'is_unique', default: false })
  isUnique!: boolean;

  @Column({ name: 'is_indexed', default: false })
  isIndexed!: boolean;

  @Column({ name: 'is_calculated', default: false })
  isCalculated!: boolean;

  @Column({ name: 'formula_expression', nullable: true })
  formulaExpression?: string;

  @Column({ name: 'default_value', nullable: true })
  defaultValue?: string;

  @Column({ name: 'validation_rules', type: 'jsonb', nullable: true })
  validationRules?: Record<string, unknown>;

  @Column({ name: 'lookup_entity_id', type: 'uuid', nullable: true })
  lookupEntityId?: string;

  @Column({ name: 'on_delete_action', nullable: true })
  onDeleteAction?: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'update_at', type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => EntityDefinitionModel, (entity) => entity.fields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entity_definition_id' })
  entityDefinition!: EntityDefinitionModel;
}
