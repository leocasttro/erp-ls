import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RECORD_REPOSITORY, RecordRepository } from '../records/application/ports/record.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityDefinitionModel } from '../metadata/infra/persistence/typeorm/entity-definition.model';

@Injectable()
export class StockService {
  constructor(
    @Inject(RECORD_REPOSITORY)
    private readonly recordRepository: RecordRepository,
    @InjectRepository(EntityDefinitionModel)
    private readonly entityRepo: Repository<EntityDefinitionModel>,
  ) {}

  @OnEvent('record.created')
  async handleRecordCreated(payload: { tenantId: string, entityDefinitionId: string, record: any }) {
    console.log('\n[STOCK MODULE] GATILHO ACIONADO!');
    
    if (payload.record?.data?.itens_pedido) {
       console.log('[STOCK MODULE] Pedido de venda detectado. Baixando estoque logicamente...');
       
       // 1. Achar a Entidade "produto"
       const produtoEntity = await this.entityRepo.findOne({ where: { technicalName: 'produto', tenantId: payload.tenantId } });
       if (!produtoEntity) return;

       // 2. Buscar todos os produtos do banco (Neste protótipo, puxamos todos e filtramos na memória)
       const produtos = await this.recordRepository.findByEntity(payload.tenantId, produtoEntity.id);

       // 3. Para cada item vendido, achar o produto e subtrair o estoque
       const itens = payload.record.data.itens_pedido;
       for (const item of itens) {
         const idVendido = item.produto_id; // Agora é o UUID do produto
         const qtdVendida = Number(item.qtd) || 0;
         
         const produtoRecord = produtos.find(p => p.id === idVendido);
         if (produtoRecord) {
           const estoqueAtual = Number(produtoRecord.data.estoque) || 0;
           const novoEstoque = estoqueAtual - qtdVendida;
           
           console.log(`[STOCK MODULE] Baixando ${qtdVendida} un. de "${produtoRecord.data.nome}". Estoque: ${estoqueAtual} -> ${novoEstoque}`);
           
           produtoRecord.data.estoque = novoEstoque;
           await this.recordRepository.update(payload.tenantId, produtoRecord.id, produtoRecord.data);
         }
       }
       console.log('[STOCK MODULE] Estoque atualizado com sucesso!\n');
    }
  }
}
