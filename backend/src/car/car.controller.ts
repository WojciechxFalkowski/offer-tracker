// src/offer/offer.controller.ts
import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { CarService } from './car.service';
import { ResponseCar } from './dto/response-car.dto';

@Controller('cars')
export class CarController {
    constructor(private readonly offerService: CarService) { }

    @Get()
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('pageSize', new DefaultValuePipe(12), ParseIntPipe) pageSize: number,
        @Query('sort', new DefaultValuePipe('createdAt')) sort: string,
        @Query('order', new DefaultValuePipe('desc')) order: string,
        @Query() filters: Record<string, any>,
    ): Promise<{ cars: ResponseCar[]; total: number }> {
        return await this.offerService.findAll(page, pageSize, sort, order, filters);
    }

    @Get('brands')
    async getBrands(): Promise<string[]> {
        return await this.offerService.getBrands();
    }

    @Get('models')
    async getModels(@Query('brand') brand?: string): Promise<string[]> {
        return await this.offerService.getModels(brand);
    }

    @Get('filter-options')
    async getFilterOptions(): Promise<{
        years: string[];
        gearboxTypes: string[];
        colors: string[];
        fuelTypes: string[];
        engineTypes: string[];
        doorCounts: string[];
        seatCounts: string[];
        driveTypes: string[];
        brands: string[];
        models: Record<string, string[]>;
    }> {
        return await this.offerService.getFilterOptions();
    }


}
