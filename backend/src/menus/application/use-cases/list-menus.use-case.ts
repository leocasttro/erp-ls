import { Inject, Injectable } from '@nestjs/common';
import { MENU_REPOSITORY_TOKEN, MenuRepository } from '../ports/menu.repository';
import { Menu } from '@/menus/entities/menu.entity';

@Injectable()
export class ListMenusUseCase {
  constructor(
    @Inject(MENU_REPOSITORY_TOKEN)
    private readonly repository: MenuRepository,
  ) {}

  async execute(tenantId: string): Promise<Menu[]> {
    return this.repository.findAllByTenant(tenantId);
  }
}
