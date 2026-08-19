import { BaseEntity } from '@/core/domain/entities/base.entity';
import { RelationType } from '../enums/relation-type.enum';

export class EntityRelation extends BaseEntity {
  tenantId!: string;
  sourceEntityId!: string;
  targetEntityId!: string;
  relationType!: RelationType;
  foreignKeyName!: string;
  cascadeDelete!: boolean;
  label?: string;

  constructor(partial: Partial<EntityRelation>) {
    super(partial.id, partial.createdAt, partial.updatedAt);
    Object.assign(this, partial);

    this.cascadeDelete = partial.cascadeDelete ?? false;
  }
}
