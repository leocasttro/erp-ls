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

  async findById(tenantId: string, recordId: string): Promise<RecordModel | null> {
    return this.repository.findOne({ where: { id: recordId, tenantId } });
  }

  async update(tenantId: string, recordId: string, data: Record<string, unknown>): Promise<RecordModel> {
    const record = await this.repository.findOne({ where: { id: recordId, tenantId } });
    if (!record) throw new Error('Record not found');
    
    record.data = data;
    return this.repository.save(record);
  }

  async delete(tenantId: string, recordId: string): Promise<void> {
    await this.repository.delete({ id: recordId, tenantId });
  }
}
