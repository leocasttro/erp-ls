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

  @Column({ type: 'varchar' })
  type!: FieldType;

  @Column({ name: 'is_required', default: false })
  isRequired!: boolean;

  @Column({ name: 'is_unique', default: false })
  isUnique!: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'update_at', type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => EntityDefinitionModel, (entity) => entity.fields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entity_definition_id' })
  entityDefinition!: EntityDefinitionModel;
}
