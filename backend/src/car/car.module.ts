import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { carProviders } from './car.providers';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
    imports: [DatabaseModule, ConfigModule],
    controllers: [CarController],
    providers: [...carProviders, CarService],
    exports: [CarService],
})
export class CarModule { }
