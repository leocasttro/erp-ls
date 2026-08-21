import { Menu } from '@/menus/entities/menu.entity';

export const MENU_REPOSITORY_TOKEN = Symbol('MENU_RESPOSITORY_TOKEN');

export interface MenuRepository {
  save(menu: Menu): Promise<Menu>;
  findByNameAndTenant(name: string, tenantId: string): Promise<Menu | null>;
  findByIdAndTenant(id: string, tenantId: string): Promise<Menu | null>;
  findAllByTenant(tenantId: string): Promise<Menu[]>;
}
