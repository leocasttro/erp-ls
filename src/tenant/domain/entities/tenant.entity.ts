import { BaseEntity } from '@/core/domain/entities/base.entity';

export class Tenant extends BaseEntity {
  name!: string;
  slug!: string;
  isActive!: boolean;

  constructor(partial: Partial<Tenant>) {
    super(partial.id, partial.createdAt, partial.updatedAt);
    Object.assign(this, partial);

    this.isActive = partial.isActive ?? true;
  }

  deactivate(): void {
    this.isActive = false;
    this.markAsUpdated();
  }
}
