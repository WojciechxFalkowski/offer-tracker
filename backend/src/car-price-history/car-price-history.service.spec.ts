import { Test, TestingModule } from '@nestjs/testing';
import { CarPriceHistoryService } from './car-price-history.service';

describe('CarPriceHistoryService', () => {
  let service: CarPriceHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarPriceHistoryService],
    }).compile();

    service = module.get<CarPriceHistoryService>(CarPriceHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
