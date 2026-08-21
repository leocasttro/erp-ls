import { Controller, Post, Get, Body, Param, Headers } from '@nestjs/common';
import { CreateRecordUseCase } from '../../application/use-cases/create-record.use-case';
import { ListRecordsUseCase } from '../../application/use-cases/list-records.use-case';
import { RecordModel } from '../persistence/typeorm/record.model';

@Controller('api/v1/records')
export class RecordController {
  constructor(
    private readonly createRecordUseCase: CreateRecordUseCase,
    private readonly listRecordsUseCase: ListRecordsUseCase,
  ) {}

  @Post(':entityId')
  async createRecord(
    @Headers('x-tenant-id') tenantId: string,
    @Param('entityId') entityId: string,
    @Body() data: Record<string, unknown>,
  ): Promise<{ message: string; data: RecordModel }> {
    if (!tenantId) throw new Error('Tenant Id é obrigatório');
    const result = await this.createRecordUseCase.execute(tenantId, entityId, data);
    return { message: 'Registro salvo com sucesso!', data: result };
  }

  @Get(':entityId')
  async listRecords(
    @Headers('x-tenant-id') tenantId: string,
    @Param('entityId') entityId: string,
  ): Promise<{ data: RecordModel[] }> {
    if (!tenantId) throw new Error('Tenant Id é obrigatório');
    const records = await this.listRecordsUseCase.execute(tenantId, entityId);
    return { data: records };
  }
}
