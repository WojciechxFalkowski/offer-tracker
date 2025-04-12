import { forwardRef, Module } from '@nestjs/common';
import { CarPriceHistoryService } from './car-price-history.service';
import { CarPriceHistoryController } from './car-price-history.controller';
import { CarModule } from '@/car/car.module';
import { SettingsModule } from '@/settings/settings.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/database/database.module';
import { carPriceHistoryProviders } from './car-price-history.providers';
import { CrawlerModule } from '@/crawler/crawler.module';

@Module({
  imports: [DatabaseModule, ConfigModule, CarModule, SettingsModule, forwardRef(() => CrawlerModule)],
  controllers: [CarPriceHistoryController],
  providers: [...carPriceHistoryProviders, CarPriceHistoryService],
  exports: [CarPriceHistoryService]
})
export class CarPriceHistoryModule { }
