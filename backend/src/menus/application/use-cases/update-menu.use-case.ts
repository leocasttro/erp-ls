import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { MENU_REPOSITORY_TOKEN, MenuRepository } from '../ports/menu.repository';
import { Menu } from '@/menus/entities/menu.entity';
import { MenuGroup } from '@/menus/entities/menu-group.entity';
import { MenuItem } from '@/menus/entities/menu-item.entity';

@Injectable()
export class UpdateMenuUseCase {
  constructor(
    @Inject(MENU_REPOSITORY_TOKEN)
    private readonly repository: MenuRepository,
  ) {}

  async execute(id: string, dto: CreateMenuDto): Promise<Menu> {
    const menu = await this.repository.findByIdAndTenant(id, dto.tenantId);

    if (!menu) {
      throw new NotFoundException(`Menu não encontrado.`);
    }

    menu.name = dto.name;
    menu.icon = dto.icon;
    menu.order = dto.order ?? menu.order;
    menu.isActive = dto.isActive ?? menu.isActive;

    menu.groups = [];

    if (dto.groups) {
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
        menu.addGroup(group);
      }
    }

    await this.repository.save(menu);

    return menu;
  }
}
