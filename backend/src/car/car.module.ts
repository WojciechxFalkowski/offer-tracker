import { forwardRef, Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { DatabaseModule } from '@/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { carProviders } from './car.providers';
import { CarPriceHistoryModule } from '@/car-price-history/car-price-history.module';

@Module({
    imports: [DatabaseModule, ConfigModule, forwardRef(() => CarPriceHistoryModule)],
    controllers: [CarController],
    providers: [...carProviders, CarService],
    exports: [CarService],
})
export class CarModule { }
