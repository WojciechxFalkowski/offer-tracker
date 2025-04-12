import { DataSource } from 'typeorm';
import { CAR_PRICE_HISTORY_REPOSITORY } from './car-price-history.contracts';
import { CarPriceHistory } from './car-price-history.entity';
import { DATA_SOURCE } from '@/database/database.contracts';


export const carPriceHistoryProviders = [
  {
    provide: CAR_PRICE_HISTORY_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CarPriceHistory),
    inject: [DATA_SOURCE],
  },
];
