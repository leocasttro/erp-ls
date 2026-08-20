import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModel } from './persistence/typeorm/menu.model';
import { MenuGroupModel } from './persistence/typeorm/menu-group.model';
import { MenuItemModel } from './persistence/typeorm/menu-item.model';
import { CreateMenuUseCase } from '../application/use-cases/create-menu.use-case';
import { MENU_REPOSITORY_TOKEN } from '../application/ports/menu.repository';
import { TypeOrmMenuRepository } from './persistence/typeorm-menu.repository';
import { MenuController } from './controllers/menu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MenuModel, MenuGroupModel, MenuItemModel])],
  controllers: [MenuController],
  providers: [
    CreateMenuUseCase,
    {
      provide: MENU_REPOSITORY_TOKEN,
      useClass: TypeOrmMenuRepository,
    },
  ],
})
export class MenusModule {}
