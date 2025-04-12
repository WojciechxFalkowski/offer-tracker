import { Controller, Get, Post } from '@nestjs/common';
import { CarPriceHistoryService } from './car-price-history.service';

@Controller('car-price-history')
export class CarPriceHistoryController {
  constructor(private readonly carPriceHistoryService: CarPriceHistoryService) { }

  @Post('process-batch')
  async processNextBatch() {
    return await this.carPriceHistoryService.processNextBatch();
  }

  @Get('status')
  async getStatus() {
    // Możemy dodać więcej informacji o statusie w przyszłości
    return { message: 'Car price tracker is running' };
  }
}
