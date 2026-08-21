import { Injectable, Inject } from '@nestjs/common';
import { RECORD_REPOSITORY, RecordRepository } from '../ports/record.repository';
import { RecordModel } from '../../infra/persistence/typeorm/record.model';
import * as crypto from 'crypto';

@Injectable()
export class CreateRecordUseCase {
  constructor(
    @Inject(RECORD_REPOSITORY)
    private readonly recordRepository: RecordRepository,
  ) {}

  async execute(
    tenantId: string,
    entityDefinitionId: string,
    data: Record<string, unknown>,
  ): Promise<RecordModel> {
    const record = {
      id: crypto.randomUUID(),
      tenantId,
      entityDefinitionId,
      data,
    };
    return this.recordRepository.create(record);
  }
}
