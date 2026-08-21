import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModel } from './persistence/typeorm/menu.model';
import { MenuGroupModel } from './persistence/typeorm/menu-group.model';
import { MenuItemModel } from './persistence/typeorm/menu-item.model';
import { CreateMenuUseCase } from '../application/use-cases/create-menu.use-case';
import { MENU_REPOSITORY_TOKEN } from '../application/ports/menu.repository';
import { TypeOrmMenuRepository } from './persistence/typeorm-menu.repository';
import { MenuController } from './controllers/menu.controller';
import { UpdateMenuUseCase } from '../application/use-cases/update-menu.use-case';
import { ListMenusUseCase } from '../application/use-cases/list-menus.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([MenuModel, MenuGroupModel, MenuItemModel])],
  controllers: [MenuController],
  providers: [
    CreateMenuUseCase,
    UpdateMenuUseCase,
    ListMenusUseCase,
    {
      provide: MENU_REPOSITORY_TOKEN,
      useClass: TypeOrmMenuRepository,
    },
  ],
})
export class MenusModule {}
