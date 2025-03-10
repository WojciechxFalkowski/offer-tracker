import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { TrackedUrlModule } from 'src/tracked-url/tracked-url.module';
import { CarModule } from 'src/car/car.module';

@Module({
  imports: [
    CarModule, TrackedUrlModule
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule { }
