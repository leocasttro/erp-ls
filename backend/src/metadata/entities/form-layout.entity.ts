import { BaseEntity } from '@/core/domain/entities/base.entity';

export class FormLayout extends BaseEntity {
  tenantId!: string;
  entityDefinitionId!: string;
  name!: string;
  isDefault!: boolean;
  layoutConfig!: Record<string, unknown>;

  constructor(partial: Partial<FormLayout>) {
    super(partial.id, partial.createdAt, partial.updatedAt);
    Object.assign(this, partial);

    this.isDefault = partial.isDefault ?? false;
  }
}
