import { Inject, Injectable } from '@nestjs/common';
import { CreateEntityDefinitionDto } from '../dto/create-entity-definition.dto';
import {
  EntityDefinitionRepository,
  ENTITY_DEFINITION_REPOSITORY_TOKEN,
} from '../ports/entity-definition.repository';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';
import { FieldDefinition } from '@/metadata/entities/field-definition.entity';

@Injectable()
export class CreateEntityDefinitionUseCase {
  constructor(
    @Inject(ENTITY_DEFINITION_REPOSITORY_TOKEN)
    private readonly repository: EntityDefinitionRepository,
  ) {}

  async execute(dto: CreateEntityDefinitionDto): Promise<EntityDefinition> {
    const existingEntity = await this.repository.findByTechnicalNameAndTenant(
      dto.technicalName,
      dto.tenantId,
    );

    if (existingEntity) {
      throw new Error(`A entidade '${dto.technicalName}' já existe para este tenant.`);
    }

    const newEntity = new EntityDefinition({
      tenantId: dto.tenantId,
      technicalName: dto.technicalName,
      displayName: dto.displayName,
      isAuditable: dto.isAuditable,
    });

    for (const fieldDto of dto.fields) {
      const field = new FieldDefinition({
        technicalName: fieldDto.technicalName,
        label: fieldDto.label,
        type: fieldDto.type,
        isRequired: fieldDto.isRequired,
      });

      newEntity.addField(field);
    }

    await this.repository.save(newEntity);

    return newEntity;
  }
}
