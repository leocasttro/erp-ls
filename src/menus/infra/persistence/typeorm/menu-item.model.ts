import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MenuGroupModel } from './menu-group.model';

@Entity('menu_items')
export class MenuItemModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId!: string;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId!: string;

  @Column({ name: 'label', type: 'varchar' })
  label!: string;

  @Column({ name: 'icon', type: 'varchar', nullable: true })
  icon?: string;

  @Column({ name: 'order', type: 'int', default: 0 })
  order!: number;

  @Column({ name: 'entity_definition_id', type: 'uuid', nullable: true })
  entityDefinitionId?: string;

  @Column({ name: 'path', type: 'varchar', nullable: true })
  path?: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => MenuGroupModel, (group) => group.items)
  @JoinColumn({ name: 'group_id' })
  group!: MenuGroupModel;
}
