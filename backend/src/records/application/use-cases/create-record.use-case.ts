import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RECORD_REPOSITORY, RecordRepository } from '../ports/record.repository';
import { RecordModel } from '../../infra/persistence/typeorm/record.model';
import * as crypto from 'crypto';

@Injectable()
export class CreateRecordUseCase {
  constructor(
    @Inject(RECORD_REPOSITORY)
    private readonly recordRepository: RecordRepository,
    private readonly eventEmitter: EventEmitter2,
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
    const savedRecord = await this.recordRepository.create(record);

    // Dispara o evento de negócio (O gatilho!)
    this.eventEmitter.emit(`record.created`, { tenantId, entityDefinitionId, record: savedRecord });

    return savedRecord;
  }
}
