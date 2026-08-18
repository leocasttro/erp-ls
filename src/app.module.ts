import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetadaModule } from './metadata/infra/metadata.module';

@Module({
  imports: [MetadaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
