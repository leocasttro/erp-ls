import { EntityDefinitionRepository } from '@/metadata/application/ports/entity-definition.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDefinitionModel } from './typeorm/entity-definition.model';
import { Repository } from 'typeorm';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';
import { FieldDefinitionModel } from './typeorm/field-definition.model';
import { FieldDefinition } from '@/metadata/entities/field-definition.entity';
import { FormLayoutModel } from './typeorm/form-layout.model';
import { EntityRelationModel } from './typeorm/entity-relation.model';
import { FormLayout } from '@/metadata/entities/form-layout.entity';
import { EntityRelation } from '@/metadata/entities/entity-relation.entity';

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
      relations: { fields: true, formLayouts: true, sourceRelations: true, targetRelations: true },
    });

    if (!found) return null;

    return this.toDomainEntity(found);
  }

  async findByIdAndTenant(id: string, tenantId: string): Promise<EntityDefinition | null> {
    const found = await this.ormRepository.findOne({
      where: { id, tenantId },
      relations: { fields: true, formLayouts: true, sourceRelations: true, targetRelations: true },
    });
    if (!found) return null;
    return this.toDomainEntity(found);
  }

  async list(tenantId: string): Promise<EntityDefinition[]> {
    const models = await this.ormRepository.find({
      where: { tenantId },
      relations: { fields: true, formLayouts: true, sourceRelations: true, targetRelations: true },
    });

    return models.map((model) => this.toDomainEntity(model));
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

    model.formLayouts = domain.formLayouts.map((fl) => {
      const layoutModel = new FormLayoutModel();
      layoutModel.id = fl.id;
      layoutModel.tenantId = fl.tenantId;
      layoutModel.name = fl.name;
      layoutModel.isDefault = fl.isDefault;
      layoutModel.layoutConfig = fl.layoutConfig;
      layoutModel.createdAt = fl.createdAt;
      layoutModel.updatedAt = fl.updatedAt;
      return layoutModel;
    });

    model.sourceRelations = domain.sourceRelations.map((sr) => {
      const relationModel = new EntityRelationModel();
      relationModel.id = sr.id;
      relationModel.tenantId = sr.tenantId;
      relationModel.targetEntityId = sr.targetEntityId;
      relationModel.relationType = sr.relationType;
      relationModel.foreignKeyName = sr.foreignKeyName;
      relationModel.cascadeDelete = sr.cascadeDelete;
      relationModel.label = sr.label;
      relationModel.createdAt = sr.createdAt;
      relationModel.updatedAt = sr.updatedAt;
      return relationModel;
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

    entity.formLayouts = model.formLayouts.map(
      (fl) =>
        new FormLayout({
          id: fl.id,
          tenantId: fl.tenantId,
          entityDefinitionId: fl.entityDefinitionId,
          name: fl.name,
          isDefault: fl.isDefault,
          layoutConfig: fl.layoutConfig,
          createdAt: fl.createdAt,
          updatedAt: fl.updatedAt,
        }),
    );

    entity.sourceRelations = model.sourceRelations.map(
      (sr) =>
        new EntityRelation({
          id: sr.id,
          tenantId: sr.tenantId,
          sourceEntityId: sr.sourceEntityId,
          targetEntityId: sr.targetEntityId,
          relationType: sr.relationType,
          foreignKeyName: sr.foreignKeyName,
          cascadeDelete: sr.cascadeDelete,
          label: sr.label,
          createdAt: sr.createdAt,
          updatedAt: sr.updatedAt,
        }),
    );

    return entity;
  }
}
