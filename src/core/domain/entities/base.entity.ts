import { randomUUID } from 'crypto';

export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id ?? randomUUID();
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  protected markAsUpdated(): void {
    this.updatedAt = new Date();
  }
}
