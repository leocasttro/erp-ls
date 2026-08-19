import { CreateEntityDefinitionDto } from '@/metadata/application/dto/create-entity-definition.dto';
import { CreateEntityDefinitionUseCase } from '@/metadata/application/use-cases/create-entity-definition.use-case';
import { GetEntityDefinitionuseCase } from '@/metadata/application/use-cases/get-entity-definition.use-case';
import { ListEntityDefinitionUseCase } from '@/metadata/application/use-cases/list-entity-definition.use-case';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';

@Controller('api/v1/metadata/entities')
export class EntityDefinitionController {
  constructor(
    private readonly createEntityUseCase: CreateEntityDefinitionUseCase,
    private readonly getUseCase: GetEntityDefinitionuseCase,
    private readonly listUseCase: ListEntityDefinitionUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateEntityDefinitionDto,
  ): Promise<{ message: string; data: EntityDefinition }> {
    const result = await this.createEntityUseCase.execute(dto);

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
