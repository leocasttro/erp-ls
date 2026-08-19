import { Inject, Injectable } from '@nestjs/common';
import { CreateEntityDefinitionDto } from '../dto/create-entity-definition.dto';
import {
  EntityDefinitionRepository,
  ENTITY_DEFINITION_REPOSITORY_TOKEN,
} from '../ports/entity-definition.repository';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';
import { FieldDefinition } from '@/metadata/entities/field-definition.entity';
import { EntityRelation } from '@/metadata/entities/entity-relation.entity';
import { FormLayout } from '@/metadata/entities/form-layout.entity';

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
      tableName: dto.tableName,
      moduleCategory: dto.moduleCategory,
      isCustom: dto.isCustom,
      isAuditable: dto.isAuditable,
      hasWorkflow: dto.hasWorkflow,
    });

    for (const fieldDto of dto.fields) {
      const field = new FieldDefinition({
        technicalName: fieldDto.technicalName,
        label: fieldDto.label,
        fieldType: fieldDto.fieldType,
        isRequired: fieldDto.isRequired,
        isUnique: fieldDto.isUnique,
        isIndexed: fieldDto.isIndexed,
        isCalculated: fieldDto.isCalculated,
        formulaExpression: fieldDto.formulaExpression,
        defaultValue: fieldDto.defaultValue,
        validationRules: fieldDto.validationRules,
        lookupEntityId: fieldDto.lookupEntityId,
        onDeleteAction: fieldDto.onDeleteAction,
      });

      newEntity.addField(field);
    }

    if (dto.formLayouts) {
      for (const layoutDto of dto.formLayouts) {
        const layout = new FormLayout({
          tenantId: dto.tenantId,
          name: layoutDto.name,
          isDefault: layoutDto.isDefault ?? false,
          layoutConfig: layoutDto.layoutConfig,
        });

        newEntity.addFormLayout(layout);
      }
    }

    if (dto.relations) {
      for (const relDto of dto.relations) {
        const relations = new EntityRelation({
          tenantId: dto.tenantId,
          targetEntityId: relDto.targetEntityId,
          relationType: relDto.relationType,
          foreignKeyName: relDto.foreignKeyName,
          cascadeDelete: relDto.cascadeDelete,
          label: relDto.label,
        });

        newEntity.addRelation(relations);
      }
    }

    await this.repository.save(newEntity);

    return newEntity;
  }
}
