import { EntityDefinitionRepository } from '@/metadata/application/ports/entity-definition.repository';
import { EntityDefinition } from '@/metadata/entities/entity-definition.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMeoryEntityDefinitionRepository implements EntityDefinitionRepository {
  private readonly items: EntityDefinition[] = [];

  async save(entity: EntityDefinition): Promise<void> {
    this.items.push(entity);

    await Promise.resolve();
  }

  async findByTechnicalNameAndTenant(
    technicalName: string,
    tenantId: string,
  ): Promise<EntityDefinition | null> {
    const found = this.items.find(
      (item) => item.technicalName === technicalName && item.tenantId === tenantId,
    );

    await Promise.resolve();

    return found ?? null;
  }
}
