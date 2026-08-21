import { Injectable, Inject } from '@nestjs/common';
import { RECORD_REPOSITORY, RecordRepository } from '../ports/record.repository';

@Injectable()
export class DeleteRecordUseCase {
  constructor(
    @Inject(RECORD_REPOSITORY)
    private readonly recordRepository: RecordRepository,
  ) {}

  async execute(tenantId: string, recordId: string): Promise<void> {
    await this.recordRepository.delete(tenantId, recordId);
  }
}
