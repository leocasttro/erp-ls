import { BaseEntity } from '@/core/domain/entities/base.entity';
import { MenuItem } from './menu-item.entity';

export class MenuGroup extends BaseEntity {
  tenantId!: string;
  menuId!: string;
  name!: string;
  order!: number;
  items!: MenuItem[];

  constructor(partial: Partial<MenuGroup>) {
    super(partial.id, partial.createdAt, partial.updatedAt);
    Object.assign(this, partial);
    this.order = partial.order ?? 0;
    this.items = partial.items ?? [];
  }

  addItem(item: MenuItem): void {
    const itemExists = this.items.find((i) => i.label === item.label);
    if (itemExists) throw new Error(`O item ${item.label} já existe neste grupo`);

    this.items.push(item);
    this.items.sort((a, b) => a.order - b.order);
    this.markAsUpdated();
  }
}
