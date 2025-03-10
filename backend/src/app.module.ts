import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';
import { CrawlerModule } from './crawler/crawler.module';
import { TrackedUrlModule } from './tracked-url/tracked-url.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CarModule } from './car/car.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true, cache: true, }), ScheduleModule.forRoot(), DatabaseModule, TrackedUrlModule, CrawlerModule, CarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
