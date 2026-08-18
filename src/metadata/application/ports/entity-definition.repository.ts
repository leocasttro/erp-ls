import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';

export const ENTITY_DEFINITION_REPOSITORY_TOKEN = Symbol('EntityDefinitionRepository');

export interface EntityDefinitionRepository {
  save(entity: EntityDefinition): Promise<void>;
  findByTechnicalNameAndTenant(
    technicalName: string,
    tenantId: string,
  ): Promise<EntityDefinition | null>;
}
