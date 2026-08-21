import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EntityDefinitionModel } from './entity-definition.model';

@Entity('form_layouts')
export class FormLayoutModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId!: string;

  @Column({ name: 'entity_definition_id', type: 'uuid' })
  entityDefinitionId!: string;

  @Column({ name: 'name', type: 'varchar' })
  name!: string;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault!: boolean;

  @Column({ name: 'layout_config', type: 'jsonb' })
  layoutConfig!: Record<string, unknown>;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  // Relação com a EntityDefinitionModel
  @ManyToOne(() => EntityDefinitionModel, (entity) => entity.formLayouts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entity_definition_id' })
  entityDefinition!: EntityDefinitionModel;
}
