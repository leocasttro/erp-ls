import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordModel } from './typeorm/record.model';
import { RecordRepository } from '../../application/ports/record.repository';

@Injectable()
export class TypeOrmRecordRepository implements RecordRepository {
  constructor(
    @InjectRepository(RecordModel)
    private readonly repository: Repository<RecordModel>,
  ) {}

  async create(record: Partial<RecordModel>): Promise<RecordModel> {
    const newRecord = this.repository.create(record);
    return this.repository.save(newRecord);
  }

  async findByEntity(tenantId: string, entityDefinitionId: string): Promise<RecordModel[]> {
    return this.repository.find({
      where: { tenantId, entityDefinitionId },
      order: { createdAt: 'DESC' },
    });
  }
}
