import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntityDefinitionModel } from './entity-definition.model';
import { RelationType } from '@/metadata/enums/relation-type.enum';

@Entity('entity_relations')
export class EntityRelationModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId!: string;

  @Column({ name: 'source_entity_id', type: 'uuid' })
  sourceEntityId!: string;

  @Column({ name: 'target_entity_id', type: 'uuid' })
  targetEntityId!: string;

  @Column({ name: 'relation_type', type: 'varchar' })
  relationType!: RelationType;

  @Column({ name: 'foreign_key_name', type: 'varchar' })
  foreignKeyName!: string;

  @Column({ name: 'cascade_delete', type: 'boolean', default: false })
  cascadeDelete!: boolean;

  @Column({ name: 'label', type: 'varchar', nullable: true })
  label?: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => EntityDefinitionModel, (entity) => entity.sourceRelations)
  @JoinColumn({ name: 'source_entity_id' })
  sourceEntity!: EntityDefinitionModel;

  @ManyToOne(() => EntityDefinitionModel, (entity) => entity.targetRelations)
  @JoinColumn({ name: 'target_entity_id' })
  targetEntity!: EntityDefinitionModel;
}
