import { RecordModel } from '../../infra/persistence/typeorm/record.model';

export const RECORD_REPOSITORY = Symbol('RECORD_REPOSITORY');

export interface RecordRepository {
  create(record: Partial<RecordModel>): Promise<RecordModel>;
  findByEntity(tenantId: string, entityDefinitionId: string): Promise<RecordModel[]>;
}
