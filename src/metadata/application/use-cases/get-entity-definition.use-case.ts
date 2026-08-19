import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ENTITY_DEFINITION_REPOSITORY_TOKEN,
  EntityDefinitionRepository,
} from '../ports/entity-definition.repository';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';

@Injectable()
export class GetEntityDefinitionuseCase {
  constructor(
    @Inject(ENTITY_DEFINITION_REPOSITORY_TOKEN)
    private readonly repository: EntityDefinitionRepository,
  ) {}

  async execute(technicalName: string, tenantId: string): Promise<EntityDefinition> {
    const entity = await this.repository.findByTechnicalNameAndTenant(technicalName, tenantId);

    if (!entity) {
      throw new NotFoundException(`Entidade '${technicalName}' não encontrada para este tenant`);
    }

    return entity;
  }
}
