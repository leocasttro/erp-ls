import { Inject, Injectable } from '@nestjs/common';
import {
  ENTITY_DEFINITION_REPOSITORY_TOKEN,
  EntityDefinitionRepository,
} from '../ports/entity-definition.repository';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';

@Injectable()
export class ListEntityDefinitionUseCase {
  constructor(
    @Inject(ENTITY_DEFINITION_REPOSITORY_TOKEN)
    private readonly repository: EntityDefinitionRepository,
  ) {}

  async execute(tenantId: string): Promise<EntityDefinition[]> {
    const entities = await this.repository.list(tenantId);

    return entities;
  }
}
