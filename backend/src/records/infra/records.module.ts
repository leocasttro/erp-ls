import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordModel } from './persistence/typeorm/record.model';
import { TypeOrmRecordRepository } from './persistence/typeorm-record.repository';
import { RECORD_REPOSITORY } from '../application/ports/record.repository';
import { CreateRecordUseCase } from '../application/use-cases/create-record.use-case';
import { ListRecordsUseCase } from '../application/use-cases/list-records.use-case';
import { UpdateRecordUseCase } from '../application/use-cases/update-record.use-case';
import { DeleteRecordUseCase } from '../application/use-cases/delete-record.use-case';
import { RecordController } from './controllers/record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecordModel])],
  controllers: [RecordController],
  providers: [
    {
      provide: RECORD_REPOSITORY,
      useClass: TypeOrmRecordRepository,
    },
    CreateRecordUseCase,
    ListRecordsUseCase,
    UpdateRecordUseCase,
    DeleteRecordUseCase,
  ],
  exports: [RECORD_REPOSITORY],
})
export class RecordsModule {}
