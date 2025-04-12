import { Test, TestingModule } from '@nestjs/testing';
import { CarPriceHistoryController } from './car-price-history.controller';
import { CarPriceHistoryService } from './car-price-history.service';

describe('CarPriceHistoryController', () => {
  let controller: CarPriceHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarPriceHistoryController],
      providers: [CarPriceHistoryService],
    }).compile();

    controller = module.get<CarPriceHistoryController>(CarPriceHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
