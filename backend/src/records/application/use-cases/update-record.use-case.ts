import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { RECORD_REPOSITORY, RecordRepository } from '../ports/record.repository';
import { RecordModel } from '../../infra/persistence/typeorm/record.model';

@Injectable()
export class UpdateRecordUseCase {
  constructor(
    @Inject(RECORD_REPOSITORY)
    private readonly recordRepository: RecordRepository,
  ) {}

  async execute(tenantId: string, recordId: string, data: Record<string, unknown>): Promise<RecordModel> {
    const existing = await this.recordRepository.findById(tenantId, recordId);
    if (!existing) {
      throw new NotFoundException('Registro não encontrado.');
    }

    // Regra de Workflow Genérica: 
    // Se o registro atual tem um status protegido e o sistema tenta alterar os dados (que não seja um simples avanço de status).
    // Neste protótipo, vamos travar completamente a edição se estiver FATURADO.
    if (existing.data?.status === 'FATURADO' && data.status !== 'CANCELADO') {
      throw new BadRequestException('Regra de Workflow: Este registro já foi FATURADO e não pode ser modificado.');
    }

    return this.recordRepository.update(tenantId, recordId, data);
  }
}
