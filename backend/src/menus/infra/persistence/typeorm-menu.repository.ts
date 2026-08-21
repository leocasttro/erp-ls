import { MenuRepository } from '@/menus/application/ports/menu.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuModel } from './typeorm/menu.model';
import { Repository } from 'typeorm';
import { MenuGroupModel } from './typeorm/menu-group.model';
import { MenuItemModel } from './typeorm/menu-item.model';
import { Menu } from '@/menus/entities/menu.entity';
import { MenuGroup } from '@/menus/entities/menu-group.entity';
import { MenuItem } from '@/menus/entities/menu-item.entity';

@Injectable()
export class TypeOrmMenuRepository implements MenuRepository {
  constructor(
    @InjectRepository(MenuModel)
    private readonly ormRepository: Repository<MenuModel>,
  ) {}

  async findByNameAndTenant(name: string, tenantId: string): Promise<Menu | null> {
    const model = await this.ormRepository.findOne({
      where: { name, tenantId },
      relations: { groups: { items: true } },
    });

    if (!model) return null;
    return this.toDomainEntity(model);
  }

  async save(menu: Menu): Promise<Menu> {
    const model = this.toOrmModel(menu);
    const savedModel = await this.ormRepository.save(model);
    return this.toDomainEntity(savedModel);
  }

  async findByIdAndTenant(id: string, tenantId: string): Promise<Menu | null> {
    const model = await this.ormRepository.findOne({
      where: { id, tenantId },
      relations: { groups: { items: true } },
    });

    if (!model) return null;
    return this.toDomainEntity(model);
  }

  async findAllByTenant(tenantId: string): Promise<Menu[]> {
    const models = await this.ormRepository.find({
      where: { tenantId },
      relations: { groups: { items: true } },
      order: { order: 'ASC', groups: { order: 'ASC', items: { order: 'ASC' } } },
    });
    return models.map((model) => this.toDomainEntity(model));
  }

  private toOrmModel(domain: Menu): MenuModel {
    const model = new MenuModel();
    model.id = domain.id;
    model.tenantId = domain.tenantId;
    model.name = domain.name;
    model.icon = domain.icon;
    model.order = domain.order;
    model.isActive = domain.isActive;
    model.createdAt = domain.createdAt;
    model.updateAt = domain.updatedAt;

    model.groups = domain.groups.map((g) => {
      const groupModel = new MenuGroupModel();
      groupModel.id = g.id;
      groupModel.tenantId = g.tenantId;
      groupModel.name = g.name;
      groupModel.order = g.order;
      groupModel.createdAt = g.createdAt;
      groupModel.updatedAt = g.updatedAt;

      groupModel.items = g.items.map((i) => {
        const itemModel = new MenuItemModel();
        itemModel.id = i.id;
        itemModel.tenantId = i.tenantId;
        itemModel.label = i.label;
        itemModel.icon = i.icon;
        itemModel.order = i.order;
        itemModel.entityDefinitionId = i.entityDefinitionId;
        itemModel.path = i.path;
        itemModel.createdAt = i.createdAt;
        itemModel.updatedAt = i.updatedAt;
        return itemModel;
      });
      return groupModel;
    });

    return model;
  }

  private toDomainEntity(model: MenuModel): Menu {
    const groups = model.groups.map((g) => {
      const items = g.items.map(
        (i) =>
          new MenuItem({
            id: i.id,
            tenantId: i.tenantId,
            groupId: g.id,
            label: i.label,
            icon: i.icon,
            order: i.order,
            entityDefinitionId: i.entityDefinitionId,
            path: i.path,
            createdAt: i.createdAt,
            updatedAt: i.updatedAt,
          }),
      );

      return new MenuGroup({
        id: g.id,
        tenantId: g.tenantId,
        menuId: model.id,
        name: g.name,
        order: g.order,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
        items,
      });
    });

    return new Menu({
      id: model.id,
      tenantId: model.tenantId,
      name: model.name,
      icon: model.icon,
      order: model.order,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updateAt,
      groups,
    });
  }
}
