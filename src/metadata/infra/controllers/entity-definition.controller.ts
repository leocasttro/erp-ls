import { CreateEntityDefinitionDto } from '@/metadata/application/dto/create-entity-definition.dto';
import { CreateEntityDefinitionUseCase } from '@/metadata/application/use-cases/create-entity-definition.use-case';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('api/v1/metadata/entities')
export class EntityDefinitionController {
  constructor(private readonly createEntityUseCase: CreateEntityDefinitionUseCase) {}

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
}
