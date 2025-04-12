import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { TrackedUrlModule } from 'src/tracked-url/tracked-url.module';
// import { CarModule } from 'src/car/car.module';
import { SettingsModule } from '@/settings/settings.module';
import { CarModule } from '@/car/car.module';

@Module({
  imports: [CarModule, TrackedUrlModule, SettingsModule],//CarModule,
  controllers: [CrawlerController],
  providers: [CrawlerService],
  exports: [CrawlerService]
})
export class CrawlerModule { }
