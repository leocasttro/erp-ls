import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { RecordsModule } from '../records/infra/records.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityDefinitionModel } from '../metadata/infra/persistence/typeorm/entity-definition.model';

@Module({
  imports: [RecordsModule, TypeOrmModule.forFeature([EntityDefinitionModel])],
  providers: [StockService],
})
export class StockModule {}
