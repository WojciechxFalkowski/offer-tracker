import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { DatabaseModule } from '@/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { carProviders } from './car.providers';

@Module({
    imports: [DatabaseModule, ConfigModule],
    controllers: [CarController],
    providers: [...carProviders, CarService],
    exports: [CarService],
})
export class CarModule { }
