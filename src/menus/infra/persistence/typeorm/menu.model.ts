import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MenuGroupModel } from './menu-group.model';

@Entity('menus')
export class MenuModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId!: string;

  @Column({ name: 'name', type: 'varchar' })
  name!: string;

  @Column({ name: 'icon', type: 'varchar', nullable: true })
  icon?: string;

  @Column({ name: 'order', type: 'int', default: 0 })
  order!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updateAt!: Date;

  @OneToMany(() => MenuGroupModel, (group) => group.menu, { cascade: true })
  groups!: MenuGroupModel[];
}
