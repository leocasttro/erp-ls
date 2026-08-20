import { BaseEntity } from '@/core/domain/entities/base.entity';

export class MenuItem extends BaseEntity {
  tenantId!: string;
  groupId!: string;
  label!: string;
  icon?: string;
  order!: number;
  entityDefinitionId?: string;
  path?: string;

  constructor(partial: Partial<MenuItem>) {
    super(partial.id, partial.createdAt, partial.updatedAt);
    Object.assign(this, partial);
    this.order = partial.order ?? 0;
  }
}
