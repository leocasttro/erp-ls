import { Body, Controller, Headers, Post, BadRequestException, Put, Param, Get } from '@nestjs/common';
import { CreateMenuDto } from '@/menus/application/dto/create-menu.dto';
import { CreateMenuUseCase } from '@/menus/application/use-cases/create-menu.use-case';
import { Menu } from '@/menus/entities/menu.entity';
import { UpdateMenuUseCase } from '@/menus/application/use-cases/update-menu.use-case';
import { ListMenusUseCase } from '@/menus/application/use-cases/list-menus.use-case';

@Controller('api/v1/menus')
export class MenuController {
  constructor(
    private readonly createMenuUseCase: CreateMenuUseCase,
    private readonly updateMenuUseCase: UpdateMenuUseCase,
    private readonly listMenusUseCase: ListMenusUseCase,
  ) {}

  @Get()
  async list(@Headers('x-tenant-id') tenantId: string): Promise<{ data: Menu[] }> {
    if (!tenantId) throw new BadRequestException('Tenant ID é obrigatório');
    const result = await this.listMenusUseCase.execute(tenantId);
    return { data: result };
  }

  @Post()
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: Omit<CreateMenuDto, 'tenantId'>,
  ): Promise<{ message: string; data: Menu }> {
    if (!tenantId) {
      throw new BadRequestException('Tenant ID é obrigatório');
    }

    const payload: CreateMenuDto = {
      ...dto,
      tenantId,
    };

    const result = await this.createMenuUseCase.execute(payload);

    return {
      message: 'Menu criado com sucesso!',
      data: result,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: Omit<CreateMenuDto, 'tenantId'>,
  ): Promise<{ message: string; data: Menu }> {
    if (!tenantId) {
      throw new BadRequestException('Tenant ID é obrigatório');
    }

    const payload: CreateMenuDto = {
      ...dto,
      tenantId,
    };

    const result = await this.updateMenuUseCase.execute(id, payload);

    return {
      message: 'Menu atualizado com sucesso!',
      data: result,
    };
  }
}
