import { EntityDefinitionRepository } from '@/metadata/application/ports/entity-definition.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDefinitionModel } from './typeorm/entity-definition.model';
import { Repository } from 'typeorm';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';
import { FieldDefinitionModel } from './typeorm/field-definition.model';
import { FieldDefinition } from '@/metadata/entities/field-definition.entity';

@Injectable()
export class TypeOrmEntityDefinitionRepository implements EntityDefinitionRepository {
  constructor(
    @InjectRepository(EntityDefinitionModel)
    private readonly ormRepository: Repository<EntityDefinitionModel>,
  ) {}

  async save(entity: EntityDefinition): Promise<void> {
    const ormModel = this.toOrmModel(entity);
    await this.ormRepository.save(ormModel);
  }

  async findByTechnicalNameAndTenant(
    technicalName: string,
    tenantId: string,
  ): Promise<EntityDefinition | null> {
    const found = await this.ormRepository.findOne({
      where: { technicalName, tenantId },
      relations: { fields: true },
    });

    if (!found) return null;

    return this.toDomainEntity(found);
  }

  private toOrmModel(domain: EntityDefinition): EntityDefinitionModel {
    const model = new EntityDefinitionModel();
    model.id = domain.id;
    model.tenantId = domain.tenantId;
    model.technicalName = domain.technicalName;
    model.displayName = domain.displayName;
    model.tableName = domain.tableName;
    model.moduleCategory = domain.moduleCategory;
    model.isCustom = domain.isCustom;
    model.isAuditable = domain.isAuditable;
    model.hasWorkflow = domain.hasWorkflow;
    model.createdAt = domain.createdAt;
    model.updatedAt = domain.updatedAt;

    model.fields = domain.fields.map((f) => {
      const fieldModel = new FieldDefinitionModel();
      fieldModel.id = f.id;
      fieldModel.technicalName = f.technicalName;
      fieldModel.label = f.label;
      fieldModel.fieldType = f.fieldType;
      fieldModel.isRequired = f.isRequired;
      fieldModel.isUnique = f.isUnique;
      fieldModel.isIndexed = f.isIndexed;
      fieldModel.isCalculated = f.isCalculated;
      fieldModel.formulaExpression = f.formulaExpression;
      fieldModel.defaultValue = f.defaultValue;
      fieldModel.validationRules = f.validationRules;
      fieldModel.lookupEntityId = f.lookupEntityId;
      fieldModel.onDeleteAction = f.onDeleteAction;
      fieldModel.createdAt = f.createdAt;
      fieldModel.updatedAt = f.updatedAt;
      return fieldModel;
    });

    return model;
  }

  private toDomainEntity(model: EntityDefinitionModel): EntityDefinition {
    const entity = new EntityDefinition({
      id: model.id,
      tenantId: model.tenantId,
      technicalName: model.technicalName,
      displayName: model.displayName,
      tableName: model.tableName,
      moduleCategory: model.moduleCategory,
      isCustom: model.isCustom,
      isAuditable: model.isAuditable,
      hasWorkflow: model.hasWorkflow,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });

    model.fields.forEach((f) => {
      entity.addField(
        new FieldDefinition({
          id: f.id,
          technicalName: f.technicalName,
          label: f.label,
          fieldType: f.fieldType,
          isRequired: f.isRequired,
          isUnique: f.isUnique,
          isIndexed: f.isIndexed,
          isCalculated: f.isCalculated,
          formulaExpression: f.formulaExpression,
          defaultValue: f.defaultValue,
          validationRules: f.validationRules,
          lookupEntityId: f.lookupEntityId,
          onDeleteAction: f.onDeleteAction,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
        }),
      );
    });

    return entity;
  }
}
