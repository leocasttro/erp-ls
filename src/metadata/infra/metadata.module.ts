import { Module } from '@nestjs/common';
import { EntityDefinitionController } from './controllers/entity-definition.controller';
import { CreateEntityDefinitionUseCase } from '../application/use-cases/create-entity-definition.use-case';
import { ENTITY_DEFINITION_REPOSITORY_TOKEN } from '../application/ports/entity-definition.repository';
import { TypeOrmEntityDefinitionRepository } from './persistence/typeorm-entity-definition.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityDefinitionModel } from './persistence/typeorm/entity-definition.model';
import { FieldDefinitionModel } from './persistence/typeorm/field-definition.model';

@Module({
  imports: [TypeOrmModule.forFeature([EntityDefinitionModel, FieldDefinitionModel])],
  controllers: [EntityDefinitionController],
  providers: [
    CreateEntityDefinitionUseCase,
    {
      provide: ENTITY_DEFINITION_REPOSITORY_TOKEN,
      useClass: TypeOrmEntityDefinitionRepository,
    },
  ],
})
export class MetadaModule {}
