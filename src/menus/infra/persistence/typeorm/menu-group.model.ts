import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { MenuModel } from './menu.model';
import { MenuItemModel } from './menu-item.model';

@Entity('menu_groups')
export class MenuGroupModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId!: string;

  @Column({ name: 'menu_id', type: 'uuid' })
  menuId!: string;

  @Column({ name: 'name', type: 'varchar' })
  name!: string;

  @Column({ name: 'order', type: 'int', default: 0 })
  order!: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => MenuModel, (menu) => menu.groups)
  @JoinColumn({ name: 'menu_id' })
  menu!: MenuModel;

  @OneToMany(() => MenuItemModel, (item) => item.group, { cascade: true })
  items!: MenuItemModel[];
}
