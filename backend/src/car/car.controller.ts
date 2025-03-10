// src/offer/offer.controller.ts
import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { CarService } from './car.service';
import { ResponseCar } from './dto/response-car.dto';

@Controller('cars')
export class CarController {
    constructor(private readonly offerService: CarService) { }

    @Get()
    async findAll(
        @Query('limit', new DefaultValuePipe(500), ParseIntPipe) limit: number,
        @Query('sort', new DefaultValuePipe('createdAt,DESC')) sort: string,
    ): Promise<ResponseCar[]> {
        return await this.offerService.findAll(limit, sort);
    }
}
