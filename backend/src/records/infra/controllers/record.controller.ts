import { Controller, Post, Get, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { CreateRecordUseCase } from '../../application/use-cases/create-record.use-case';
import { ListRecordsUseCase } from '../../application/use-cases/list-records.use-case';
import { UpdateRecordUseCase } from '../../application/use-cases/update-record.use-case';
import { DeleteRecordUseCase } from '../../application/use-cases/delete-record.use-case';
import { RecordModel } from '../persistence/typeorm/record.model';

@Controller('api/v1/records')
export class RecordController {
  constructor(
    private readonly createRecordUseCase: CreateRecordUseCase,
    private readonly listRecordsUseCase: ListRecordsUseCase,
    private readonly updateRecordUseCase: UpdateRecordUseCase,
    private readonly deleteRecordUseCase: DeleteRecordUseCase,
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

  @Put(':entityId/:recordId')
  async updateRecord(
    @Headers('x-tenant-id') tenantId: string,
    @Param('recordId') recordId: string,
    @Body() data: Record<string, unknown>,
  ): Promise<{ message: string; data: RecordModel }> {
    if (!tenantId) throw new Error('Tenant Id é obrigatório');
    const result = await this.updateRecordUseCase.execute(tenantId, recordId, data);
    return { message: 'Registro atualizado com sucesso!', data: result };
  }

  @Delete(':entityId/:recordId')
  async deleteRecord(
    @Headers('x-tenant-id') tenantId: string,
    @Param('recordId') recordId: string,
  ): Promise<{ message: string }> {
    if (!tenantId) throw new Error('Tenant Id é obrigatório');
    await this.deleteRecordUseCase.execute(tenantId, recordId);
    return { message: 'Registro excluído com sucesso!' };
  }
}
