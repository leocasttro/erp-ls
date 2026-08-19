import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { FieldDefinitionModel } from './field-definition.model';
import { EntityRelationModel } from './entity-relation.model';
import { FormLayoutModel } from './form-layout.model';

@Entity('entity_definitions')
export class EntityDefinitionModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId!: string;

  @Column({ name: 'technical_name' })
  technicalName!: string;

  @Column({ name: 'display_name' })
  displayName!: string;

  @Column({ name: 'table_name' })
  tableName!: string;

  @Column({ name: 'module_category', default: true })
  moduleCategory?: string;

  @Column({ name: 'is_custom', default: true })
  isCustom!: boolean;

  @Column({ name: 'is_auditable', default: true })
  isAuditable!: boolean;

  @Column({ name: 'has_workflow', default: false })
  hasWorkflow!: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  // Carrega os campos quando buscarmos o formulário no banco
  @OneToMany(() => FieldDefinitionModel, (field) => field.entityDefinition, {
    cascade: true,
  })
  fields!: FieldDefinitionModel[];

  @OneToMany(() => FormLayoutModel, (layout) => layout.entityDefinition, {
    cascade: true,
  })
  formLayouts!: FormLayoutModel[];

  @OneToMany(() => EntityRelationModel, (relation) => relation.sourceEntity, {
    cascade: true,
  })
  sourceRelations!: EntityRelationModel[];

  @OneToMany(() => EntityRelationModel, (relation) => relation.targetEntity, {
    cascade: true,
  })
  targetRelations!: EntityRelationModel[];
}
