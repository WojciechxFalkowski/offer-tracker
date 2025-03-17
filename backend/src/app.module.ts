import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import configuration from './database/database-configuration';
import { CrawlerModule } from './crawler/crawler.module';
import { TrackedUrlModule } from './tracked-url/tracked-url.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CarModule } from './car/car.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true, cache: true, }), ScheduleModule.forRoot(), DatabaseModule, SettingsModule, TrackedUrlModule, CrawlerModule, CarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
