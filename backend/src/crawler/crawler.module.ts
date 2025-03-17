import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { TrackedUrlModule } from 'src/tracked-url/tracked-url.module';
import { CarModule } from 'src/car/car.module';
import { SettingsModule } from '@/settings/settings.module';

@Module({
  imports: [
    CarModule, TrackedUrlModule, SettingsModule
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule { }
