import { Module } from '@nestjs/common';
import { MetadaModule } from './metadata/infra/metadata.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusModule } from './menus/infra/menus.module';
import { RecordsModule } from './records/infra/records.module';
import { StockModule } from './stock/stock.module';

import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    MetadaModule,
    MenusModule,
    RecordsModule,
    StockModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
