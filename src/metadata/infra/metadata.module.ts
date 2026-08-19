import { Module } from '@nestjs/common';
import { EntityDefinitionController } from './controllers/entity-definition.controller';
import { CreateEntityDefinitionUseCase } from '../application/use-cases/create-entity-definition.use-case';
import { ENTITY_DEFINITION_REPOSITORY_TOKEN } from '../application/ports/entity-definition.repository';
import { TypeOrmEntityDefinitionRepository } from './persistence/typeorm-entity-definition.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityDefinitionModel } from './persistence/typeorm/entity-definition.model';
import { FieldDefinitionModel } from './persistence/typeorm/field-definition.model';
import { FormLayoutModel } from './persistence/typeorm/form-layout.model';
import { EntityRelationModel } from './persistence/typeorm/entity-relation.model';
import { GetEntityDefinitionuseCase } from '../application/use-cases/get-entity-definition.use-case';
import { ListEntityDefinitionUseCase } from '../application/use-cases/list-entity-definition.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EntityDefinitionModel,
      FieldDefinitionModel,
      FormLayoutModel,
      EntityRelationModel,
    ]),
  ],
  controllers: [EntityDefinitionController],
  providers: [
    CreateEntityDefinitionUseCase,
    GetEntityDefinitionuseCase,
    ListEntityDefinitionUseCase,
    {
      provide: ENTITY_DEFINITION_REPOSITORY_TOKEN,
      useClass: TypeOrmEntityDefinitionRepository,
    },
  ],
})
export class MetadaModule {}
