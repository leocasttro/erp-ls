import { Inject, Injectable } from '@nestjs/common';
import { MENU_REPOSITORY_TOKEN, MenuRepository } from '../ports/menu.repository';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { MenuGroup } from '@/menus/entities/menu-group.entity';
import { Menu } from '@/menus/entities/menu.entity';
import { MenuItem } from '@/menus/entities/menu-item.entity';

@Injectable()
export class CreateMenuUseCase {
  constructor(
    @Inject(MENU_REPOSITORY_TOKEN)
    private readonly repository: MenuRepository,
  ) {}

  async execute(dto: CreateMenuDto): Promise<Menu> {
    const existingMenu = await this.repository.findByNameAndTenant(dto.name, dto.tenantId);

    if (existingMenu) throw new Error(`O menu ${dto.name} já existe para esse tenant.`);

    const newMenu = new Menu({
      tenantId: dto.tenantId,
      name: dto.name,
      icon: dto.icon,
      order: dto.order,
      isActivate: dto.isActivate,
    });

    for (const groupDto of dto.groups) {
      const group = new MenuGroup({
        tenantId: dto.tenantId,
        name: groupDto.name,
        order: groupDto.order ?? 0,
      });

      if (groupDto.items) {
        for (const itemDto of groupDto.items) {
          const item = new MenuItem({
            tenantId: dto.tenantId,
            label: itemDto.label,
            icon: itemDto.icon,
            order: itemDto.order ?? 0,
            entityDefinitionId: itemDto.entityDefinitionId,
            path: itemDto.path,
          });

          group.addItem(item);
        }
      }

      newMenu.addGroup(group);
    }

    await this.repository.save(newMenu);

    return newMenu;
  }
}
