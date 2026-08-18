import { Module } from '@nestjs/common';
import { EntityDefinitionController } from './controllers/entity-definition.controller';
import { CreateEntityDefinitionUseCase } from '../application/use-cases/create-entity-definition.use-case';
import { ENTITY_DEFINITION_REPOSITORY_TOKEN } from '../application/ports/entity-definition.repository';
import { InMeoryEntityDefinitionRepository } from './persistence/in-memory-entity- definition.repository';

@Module({
  controllers: [EntityDefinitionController],
  providers: [
    CreateEntityDefinitionUseCase,
    {
      provide: ENTITY_DEFINITION_REPOSITORY_TOKEN,
      useClass: InMeoryEntityDefinitionRepository,
    },
  ],
})
export class MetadaModule {}
