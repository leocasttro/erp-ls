import { RecordModel } from '../../infra/persistence/typeorm/record.model';

export const RECORD_REPOSITORY = Symbol('RECORD_REPOSITORY');

export interface RecordRepository {
  create(record: Partial<RecordModel>): Promise<RecordModel>;
  findByEntity(tenantId: string, entityDefinitionId: string): Promise<RecordModel[]>;
  findById(tenantId: string, recordId: string): Promise<RecordModel | null>;
  update(tenantId: string, recordId: string, data: Record<string, unknown>): Promise<RecordModel>;
  delete(tenantId: string, recordId: string): Promise<void>;
}
