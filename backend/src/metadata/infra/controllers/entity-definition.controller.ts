import { CreateEntityDefinitionDto } from '@/metadata/application/dto/create-entity-definition.dto';
import { CreateEntityDefinitionUseCase } from '@/metadata/application/use-cases/create-entity-definition.use-case';
import { GetEntityDefinitionuseCase } from '@/metadata/application/use-cases/get-entity-definition.use-case';
import { ListEntityDefinitionUseCase } from '@/metadata/application/use-cases/list-entity-definition.use-case';
import { UpdateEntityDefinitionUseCase } from '@/metadata/application/use-cases/update-entity-definition.use-case';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';
import { Body, Controller, Get, Headers, Param, Post, Put } from '@nestjs/common';

@Controller('api/v1/metadata/entities')
export class EntityDefinitionController {
  constructor(
    private readonly createEntityUseCase: CreateEntityDefinitionUseCase,
    private readonly getUseCase: GetEntityDefinitionuseCase,
    private readonly listUseCase: ListEntityDefinitionUseCase,
    private readonly updateUseCase: UpdateEntityDefinitionUseCase,
  ) {}

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: Omit<CreateEntityDefinitionDto, 'tenantId'>,
  ): Promise<{ message: string; data: EntityDefinition }> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório no cabeçalho (x-tenant-id)');
    }

    const payload: CreateEntityDefinitionDto = {
      ...dto,
      tenantId,
    };

    const result = await this.updateUseCase.execute(id, payload);

    return {
      message: 'Formulário atualizado com sucesso!',
      data: result,
    };
  }

  @Post()
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: Omit<CreateEntityDefinitionDto, 'tenantId'>,
  ): Promise<{ message: string; data: EntityDefinition }> {
    if (!tenantId) {
      throw new Error('Tenant ID é obrigatório no cabeçalho (x-tenant-id)');
    }

    const payload: CreateEntityDefinitionDto = {
      ...dto,
      tenantId,
    };

    const result = await this.createEntityUseCase.execute(payload);

    return {
      message: 'Formulário criado com sucesso!',
      data: result,
    };
  }

  @Get(':technicalName')
  async get(
    @Param('technicalName') technicalName: string,
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<EntityDefinition> {
    if (!tenantId) throw new Error('Tenant Id é obrigatório');
    const entity = await this.getUseCase.execute(technicalName, tenantId);
    return entity;
  }

  @Get()
  async list(@Headers('x-tenant-id') tenantId: string): Promise<EntityDefinition[]> {
    if (!tenantId) throw new Error('Tenant Id é obrigatório');
    return this.listUseCase.execute(tenantId);
  }
}
