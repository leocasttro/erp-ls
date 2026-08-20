import { Body, Controller, Headers, Post, BadRequestException } from '@nestjs/common';
import { CreateMenuDto } from '@/menus/application/dto/create-menu.dto';
import { CreateMenuUseCase } from '@/menus/application/use-cases/create-menu.use-case';
import { Menu } from '@/menus/entities/menu.entity';

@Controller('api/v1/menus')
export class MenuController {
  constructor(private readonly createMenuUseCase: CreateMenuUseCase) {}

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
}
