import { Injectable, Inject } from '@nestjs/common';
import { RECORD_REPOSITORY, RecordRepository } from '../ports/record.repository';
import { RecordModel } from '../../infra/persistence/typeorm/record.model';

@Injectable()
export class ListRecordsUseCase {
  constructor(
    @Inject(RECORD_REPOSITORY)
    private readonly recordRepository: RecordRepository,
  ) {}

  async execute(tenantId: string, entityDefinitionId: string): Promise<RecordModel[]> {
    return this.recordRepository.findByEntity(tenantId, entityDefinitionId);
  }
}
