import { BaseEntity } from '@/core/domain/entities/base.entity';
import { MenuGroup } from './menu-group.entity';

export class Menu extends BaseEntity {
  tenantId!: string;
  name!: string;
  icon?: string;
  order!: number;
  isActive!: boolean;
  groups!: MenuGroup[];

  constructor(partial: Partial<Menu>) {
    super(partial.id, partial.createdAt, partial.updatedAt);
    Object.assign(this, partial);

    this.order = partial.order ?? 0;
    this.isActive = partial.isActive ?? true;
    this.groups = partial.groups ?? [];
  }

  addGroup(group: MenuGroup): void {
    const groupExists = this.groups.find((g) => g.name === group.name);
    if (groupExists) throw new Error(`O grupo ${group.name} já existe neste menu.`);

    this.groups.push(group);

    this.groups.sort((a, b) => a.order - b.order);
    this.markAsUpdated();
  }
}
