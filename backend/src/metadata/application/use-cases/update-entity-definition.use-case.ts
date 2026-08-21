import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntityDefinitionDto } from '../dto/create-entity-definition.dto';
import {
  EntityDefinitionRepository,
  ENTITY_DEFINITION_REPOSITORY_TOKEN,
} from '../ports/entity-definition.repository';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';
import { FieldDefinition } from '@/metadata/entities/field-definition.entity';
import { FormLayout } from '@/metadata/entities/form-layout.entity';

@Injectable()
export class UpdateEntityDefinitionUseCase {
  constructor(
    @Inject(ENTITY_DEFINITION_REPOSITORY_TOKEN)
    private readonly repository: EntityDefinitionRepository,
  ) {}

  async execute(id: string, dto: CreateEntityDefinitionDto): Promise<EntityDefinition> {
    const existingEntity = await this.repository.findByIdAndTenant(id, dto.tenantId);

    if (!existingEntity) {
      throw new NotFoundException(`Formulário não encontrado.`);
    }

    // Atualiza os dados principais
    existingEntity.displayName = dto.displayName;

    // Recria os campos (TypeORM deletará os antigos devido ao orphanedRowAction: 'delete')
    existingEntity.fields = dto.fields.map((fieldDto) => {
      return new FieldDefinition({
        tenantId: dto.tenantId,
        technicalName: fieldDto.technicalName,
        label: fieldDto.label,
        fieldType: fieldDto.fieldType,
        isRequired: fieldDto.isRequired ?? false,
        isUnique: fieldDto.isUnique ?? false,
        isIndexed: fieldDto.isIndexed ?? false,
        isCalculated: fieldDto.isCalculated ?? false,
        formulaExpression: fieldDto.formulaExpression,
        defaultValue: fieldDto.defaultValue,
        validationRules: fieldDto.validationRules,
        lookupEntityId: fieldDto.lookupEntityId,
        onDeleteAction: fieldDto.onDeleteAction,
      });
    });

    if (dto.formLayouts) {
      existingEntity.formLayouts = dto.formLayouts.map((layoutDto) => {
        return new FormLayout({
          tenantId: dto.tenantId,
          name: layoutDto.name,
          isDefault: layoutDto.isDefault,
          layoutConfig: layoutDto.layoutConfig,
        });
      });
    }

    await this.repository.save(existingEntity);

    return existingEntity;
  }
}
